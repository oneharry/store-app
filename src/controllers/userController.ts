import { Request, Response, NextFunction } from "express";
import { LoginSchema, RegisterUserSchema } from "../schemas/inputValidationSchema";
import { getCurrentUser, registerUser, userLogin, userLogout } from "../services/userService";
import { IUser, UserLogin } from "../types/userType";
import { HttpCustomError } from "../utils/errorUtils";


/**
 * Registers a new user by validating the request body and saving the user to the database.
 *
 * Validates the request body using `RegisterUserSchema` 
 * register user via the `registerUser` service. Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request with req.body.
 * @param {Response} res - The HTTP response sends user data.
 * @param {NextFunction} next - Passes errors to the global error handler.
 *
 * @returns {void} Responds with a 201 status and the created product data.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body data
        const validatedUser = RegisterUserSchema.parse(req.body) as IUser;
        const user = await registerUser(validatedUser);
        res.status(201).json({ message: 'User registered successfully', data: user });
    } catch (error) {
        next(error);
    }
};


/**
 * Authenticates a user by validating the request body and generating a JWT token.
 *
 * Validates the request body using `LoginSchema` 
 * log in user via the `userLogin` service. Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request contains the login credentials.
 * @param {Response} res - The HTTP response sending the generated JWT token.
 * @param {NextFunction} next - Passes any errors to the global error handler.
 *
 * @returns {void} Responds with a 200 status and the generated JWT token.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body
        const validatedUser = LoginSchema.parse(req.body) as UserLogin;
        // register user
        const token = await userLogin(validatedUser);
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};


/**
 * Logs out a user by invalidating their authentication token.
 *
 * Extracts the JWT token from the request header. Calls the `userLogout` service 
 * to invalidate the token. Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request containing the authorization token in the headers.
 * @param {Response} res - The HTTP response sending a success message after logging out.
 * @param {NextFunction} next - Passes any errors to the global error handler.
 *
 * @returns {void} Responds with a 200 status and a logout success message.
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] as string;
        if (!token) {
            throw new HttpCustomError(400, 'No token provided');
        }

        await userLogout(token);

        res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        next(error);
    }
};


/**
 * Retrieves the current user's data.
 *
 * Extracts the `userId` from the req.user
 * Calls the user's information via the `getCurrentUser` service. Errors 
 * are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request containing the authenticated user ID.
 * @param {Response} res - The HTTP response containing the current user's data.
 * @param {NextFunction} next - Passes any errors to the global error handler.
 *
 * @returns {void} Responds with a 200 status and the current user's data.
 */
export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            throw new HttpCustomError(400, 'No signed in user');
        }

        const user = await getCurrentUser(userId)

        res.status(200).json({ data: user });
    } catch (error) {
        next(error);
    }
}; 