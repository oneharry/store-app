import { Request, Response, NextFunction } from "express";
import { LoginSchema, RegisterUserSchema } from "../schemas/validationSchema";
import { getCurrentUser, registerUser, userLogin, userLogout } from "../services/userService";
import { IUser, UserLogin } from "../interfaces/userInterface";


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

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body
        const validatedUser = LoginSchema.parse(req.body) as UserLogin;
        // register user
        const token = await userLogin(validatedUser);
        res.status(201).json({ token });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] as string;
        await userLogout(token);

        res.status(201).json({ message: 'Logged out' });
    } catch (error) {
        next(error);
    }
};

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;

        const user = await getCurrentUser(userId) 

        res.status(200).json({ data: user });
    } catch (error) {
        next(error);
    }
}; 