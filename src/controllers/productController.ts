import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/validationSchema";
import { createProduct, getAllProducts, updateProduct, getProductById, deleteProduct } from "../services/productService";
import { handleZodError } from "../utils/errorUtils";
import { IProduct } from "../interfaces/productInterface";


export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body data
        const validatedProduct = CreateProductSchema.parse(req.body) as IProduct;
        const product = await createProduct(validatedProduct);

        res.status(201).json({ message: 'Product added successfully', data: product });
    } catch (error) {
        next(error);
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
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await getAllProducts();

        res.status(200).json({ data: products });
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;

        const product = await getProductById(productId);

        res.status(200).json({ data: product });
    } catch (error) {
        next(error);
    }
};

export const removeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id as string;

        const user = await deleteProduct(productId);

        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};