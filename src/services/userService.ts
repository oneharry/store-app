import * as bcrypt from 'bcrypt';
import User from '../models/userModel';
import { HttpCustomError } from '../utils/errorUtils';
import { generateToken } from '../utils/jwtUtils';
import BlacklistedToken from '../models/blacklistedTokenModel';
import { IUser, UserLogin } from '../types/userType';


/**
 * Registers a new user by validating the user data. Saves the new the user to DB.
 *
 * @param {IUser} userData - The user data to register
 * @returns {Promise<IUser>} A promise that resolves with the created user data.
 *
 * @throws {HttpCustomError} Throws an error if the email is already in use or if there is a server-side issue.
 */
export const registerUser = async (userData: IUser): Promise<IUser> => {
    try {
        const { username, email, password } = userData;
        // hash raw password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // throws error if email has been registered
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new HttpCustomError(400, "Email is already in use");
        }

        // create user, and return saved user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        return await user.save();
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}


/**
 * Authenticate user by validating their email and password. Generates a JWT token.
 *
 * @param {UserLogin} userData - The login credentials.
 * @returns {Promise<string>} A promise that resolves with a JWT token for the authenticated user.
 *
 * @throws {HttpCustomError} 
 * - Throws an error with status `404` if the user is not found.
 * - Throws an error with status `400` if the password is incorrect.
 * - Throws a general server-side error if any unexpected issues occur.
 */
export const userLogin = async (userData: UserLogin): Promise<string> => {
    try {
        const { email, password } = userData;
        // fetch user
        const user = await User.findOne({ email })

        // throws error is user is not found
        if (!user) {
            throw new HttpCustomError(404, 'Profile do not exist');
        }

        // throws error if passord is incorrect
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpCustomError(400, 'Incorrect email or password');
        }

        // generate jwt token.
        const token = generateToken(user.id, email);

        // return token
        return token;
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}


/**
 * Logs out a user by blacklisting their JWT token.
 *
 * @param {string} token - The JWT token to be blacklisted.
 * @returns {Promise<void>} A promise that resolves when the token has been successfully blacklisted.
 *
 * @throws {HttpCustomError} Throws a general server-side error if any unexpected issues occur.
 */
export const userLogout = async (token: string): Promise<void> => {
    try {
        // add token to blacklist
        const blacklistedToken = new BlacklistedToken({
            token,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });

        await blacklistedToken.save();
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}


/**
 * Retrieves the current user
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<IUser>} A promise that resolves with the user data.
 */
export const getCurrentUser = async (userId: string): Promise<IUser> => {
    try {
        // fetch user usig userId
        const user = await User.findOne({ _id: userId })

        //throw error is user not found
        if (!user) {
            throw new HttpCustomError(404, "User not found");
        }
        return user;
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}
