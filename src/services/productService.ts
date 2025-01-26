import * as bcrypt from 'bcrypt';
import User from '../models/userModel';
import Product from '../models/productModel';
import { HttpCustomError } from '../middlewares/errorMiddleware';


export const createProduct = async (productData) => {
    try {

        const product = new Product(productData);

        return await product.save();

    } catch (error) {
        throw error;
    }
}

export const updateProduct = async (productId, productData) => {
    try {
        const product = await Product.findOne({ _id: productId })

        if (!product) {
            throw new HttpCustomError(404, "Product not found")
        }

        const updatedProduct = Object.assign(product, productData)
        return updatedProduct;

    } catch (error) {
        throw error;
    }
}

export const getAllProducts = async () => {
    try {
        const products = await Product.find();

        return products;

    } catch (error) {
        throw error;
    }
}

export const getProductById = async (productId: string) => {
    try {
        const product = await Product.findOne({ _id: productId });
        return await product.save();

    } catch (error) {
        throw error;
    }
}

export const deleteProduct = async (productId) => {
    try {
        const product = await Product.findByIdAndDelete(productId);
        return product;
    } catch (error) {
        throw error;
    }
}