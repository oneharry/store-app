import { Request, Response, NextFunction } from "express";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/validationSchema";
import { registerUser } from "../services/productService";


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body data
        const validatedUser = CreateProductSchema.parse(req.body);
        const user = await registerUser(validatedUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;
        // validate request body
        const validatedUser = UpdateProductSchema.parse(req.body);
        // register user
        const user = await registerUser(validatedUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //const user = await registerUser();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;

        //const user = await registerUser(validatedUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;

        //const user = await registerUser(validatedUser);

        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};