import { Request, Response, NextFunction } from "express";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/validationSchema";
import { createProduct, getAllProducts, updateProduct, getProductById, deleteProduct } from "../services/productService";


export const createProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body data
        const validatedProduct = CreateProductSchema.parse(req.body);
        const user = await createProduct(validatedProduct);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;
        // validate request body
        const validatedProduct = UpdateProductSchema.parse(req.body);
        // update product
        const product = await updateProduct(productId, validatedProduct);
        res.status(201).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await getAllProducts();

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: 'error fetching products' });
    }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;

        const product = await getProductById(productId);

        res.status(201).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const removeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;

        const user = await deleteProduct(productId);

        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};