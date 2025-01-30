import { Request, Response, NextFunction } from "express";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/inputValidationSchema";
import { createProduct, getAllProducts, updateProduct, getProductById, deleteProduct } from "../services/productService";
import { IProduct } from "../types/productType";
import { HttpCustomError } from "../utils/errorUtils";


/**
 * Adds a new product to the database.
 *
 * Validates the request body using `CreateProductSchema` and saves the product 
 * with the `createProduct` service. Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request containing product data in the body.
 * @param {Response} res - The HTTP response to send the created product.
 * @param {NextFunction} next - Passes errors to the global error handler.
 *
 * @returns {void} Responds with a 201 status and the created product data.
 */
export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body
        const validatedProduct = CreateProductSchema.parse(req.body) as IProduct;
        const product = await createProduct(validatedProduct);

        res.status(201).json({ message: 'Product added successfully', data: product });
    } catch (error) {
        next(error);
    }
};


/**
 * Updates an existing product in the database.
 *
 * Validates the request body using `UpdateProductSchema` and updates the product 
 * with the `updateProduct` service. Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request with the product ID in the params 
 * and updated product data.
 * @param {Response} res - The HTTP response to send the updated product.
 * @param {NextFunction} next - Passes errors to the global error handler.
 *
 * @returns {void} Responds with a 200 status and the updated product data.
 */
export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // product ID in the params
        // throws error if productId is null or undefined
        const productId = req.params.id as string;
        if (!productId) {
            throw new HttpCustomError(400, 'Product ID is required');
        }

        // validate request body using UpdateProductSchema
        const validatedProduct = UpdateProductSchema.parse(req.body);
        // update product
        const product = await updateProduct(productId, validatedProduct);
        res.status(200).json({ data: product });
    } catch (error) {
        next(error);
    }
};


/**
 * Retrieves all products from the database.
 *
 * Fetches all products via the `getAllProducts` service. 
 * Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response to send the array of products.
 * @param {NextFunction} next - Passes errors to the global error handler.
 *
 * @returns {void} Responds with a 200 status and the array of products.
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await getAllProducts();

        res.status(200).json({ data: products });
    } catch (error) {
        next(error);
    }
};


/**
 * Retrieves a product by the ID.
 *
 * Fetches the product via the `getProductById` service using the `id` 
 * parameter from the request. Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request containing the product ID in the params.
 * @param {Response} res - The HTTP response to send the product data.
 * @param {NextFunction} next - Passes errors to the global error handler.
 *
 * @returns {void} Responds with a 200 status and the product data.
 */
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // product ID in the params
        // throws error if productId is null or undefined
        const productId = req.params.id as string;
        if (!productId) {
            throw new HttpCustomError(400, 'Product ID is required');
        }

        const product = await getProductById(productId);

        res.status(200).json({ data: product });
    } catch (error) {
        next(error);
    }
};


/**
 * Deletes a product by its ID.
 *
 * Removes the product via the `deleteProduct` service using the `id` 
 * parameter from the request. Errors are passed to the global error middleware.
 *
 * @param {Request} req - The HTTP request with the product ID in params.
 * @param {Response} res - The HTTP response to confirm successful deletion.
 * @param {NextFunction} next - Passes errors to the global error handler.
 *
 * @returns {void} Responds with a 200 status and a success message.
 */
export const removeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // product ID in the params
        // throws error if productId is null or undefined
        const productId = req.params.id as string;
        if (!productId) {
            throw new HttpCustomError(400, 'Product ID is required');
        }

        const user = await deleteProduct(productId);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};