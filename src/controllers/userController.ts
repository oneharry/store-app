import { Request, Response, NextFunction } from "express";
import { LoginSchema, RegisterUserSchema } from "../schemas/validationSchema";
import { registerUser } from "../services/productService";


export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body data
        const validatedUser = RegisterUserSchema.parse(req.body);
        const user = await registerUser(validatedUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body
        const validatedUser = LoginSchema.parse(req.body);
        // register user
        const user = await registerUser(validatedUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedUser = RegisterUserSchema.parse(req.body);

        const user = await registerUser(validatedUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedUser = RegisterUserSchema.parse(req.body);

        const user = await registerUser(validatedUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};