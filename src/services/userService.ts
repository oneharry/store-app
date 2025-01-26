import * as bcrypt from 'bcrypt';
import User from '../models/userModel';
import { HttpCustomError } from '../middlewares/errorMiddleware';
import { generateToken } from '../utils/jwtUtils';
import BlacklistedToken from '../models/blacklistedTokenModel';


export const registerUser = async (userData) => {
    try {
        const { username, email, password, avatar } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new HttpCustomError(400, "Email is already in use");
        }
        const user = new User({
            username,
            email,
            password: hashedPassword,
            avatar
        });

        return await user.save();
    } catch (error) {
        throw error;
    }
}

export const userLogin = async (userData) => {
    try {
        const { email, password } = userData;
        const user = await User.findOne({ email })

        if (!user) {
            throw new HttpCustomError(404, 'User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpCustomError(400, 'Incorrect email or password');
        }

        const token = generateToken(user.id, email);
        return token;
    } catch (error) {
        throw error;
    }
}

export const userLogout = async (token) => {
    try {
        const blacklistedToken = new BlacklistedToken({
            token,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });

        await blacklistedToken.save();
    } catch (error) {
        throw error;
    }
}

export const getCurrentUser = async (email: string) => {
    try {
        const user = await User.find({ email })
    } catch (error) {
        throw error;
    }
}

export const registerUse = async (userData) => {
    try {
        const { username, email, password, avatar } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            avatar
        });

        return await user.save();
    } catch (error) {
        throw error;
    }
}