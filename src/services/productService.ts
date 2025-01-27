import * as bcrypt from 'bcrypt';
import User from '../models/userModel';
import Product from '../models/productModel';
import { HttpCustomError } from '../middlewares/errorMiddleware';
import { IProduct, ProductResponse, ProductUpdate } from '../interfaces/productInterface';


export const createProduct = async (productData: IProduct): Promise<ProductResponse> => {
    try {

        const product = new Product(productData);

        return await product.save();

    } catch (error) {
        throw new HttpCustomError(error.status || 500, error?.message );
    }
}

export const updateProduct = async (productId: string, productData: ProductUpdate): Promise<ProductResponse> => {
    try {
        const product = await Product.findOne({ _id: productId })

        if (!product) {
            throw new HttpCustomError(404, "Product not found")
        }

        const updatedProduct = Object.assign(product, productData)
        return updatedProduct;

    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}

export const getAllProducts = async (): Promise<ProductResponse[]> => {
    try {
        const products = await Product.find();

        return products;

    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}

export const getProductById = async (productId: string): Promise<ProductResponse> => {
    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            throw new HttpCustomError(404, "Product not found" );
        }
        return product;
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}

export const deleteProduct = async (productId: string): Promise<ProductResponse> => {
    try {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            throw new HttpCustomError(404, 'Product not found');
        }

        return product;
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}