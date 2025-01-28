import Product from '../models/productModel';
import { HttpCustomError } from '../middlewares/errorMiddleware';
import { IProduct, ProductResponse, ProductUpdate } from '../interfaces/productInterface';


/**
 * Creates a new product in the database.
 *
 * @param {IProduct} productData - The product details to be saved.
 * @returns {Promise<ProductResponse>} The saved product data.
 * @throws {HttpCustomError} If an error occurs during product creation.
 */
export const createProduct = async (productData: IProduct): Promise<ProductResponse> => {
    try {
        const product = new Product(productData);

        return await product.save();
    } catch (error) {
        throw new HttpCustomError(error.status || 500, error?.message );
    }
}


/**
 * Updates an existing product in the database.
 *
 * @param {string} productId - The ID of the product.
 * @param {ProductUpdate} productData - The updated data for the product
 * @returns {Promise<ProductResponse>} The updated product
 * .
 * @throws {HttpCustomError} If the product is not found or an error occurs during the update.
 */
export const updateProduct = async (productId: string, productData: ProductUpdate): Promise<ProductResponse> => {
    try {
        //find product by id
        const product = await Product.findOne({ _id: productId })

        // throw error if product is not found
        if (!product) {
            throw new HttpCustomError(404, "Product not found")
        }
    
        // update the product with the data
        Object.assign(product, productData)

        //save and return the updated product
        const updatedProduct = await product.save();
        return updatedProduct;

    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}


/**
 * Retrieves all products from the database.
 *
 * @returns {Promise<ProductResponse[]>} An array of all products.
 * 
 * @throws {HttpCustomError} If an error occurs during the retrieval process.
 */
export const getAllProducts = async (): Promise<ProductResponse[]> => {
    try {
        const products = await Product.find();

        return products;
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}


/**
 * Retrieves a product by its ID from the database.
 *
 * @param {string} productId - The ID of the product.
 * @returns {Promise<ProductResponse>} The product data.
 * 
 * @throws {HttpCustomError} If the product is not found or an error occurs during retrieval.
 */
export const getProductById = async (productId: string): Promise<ProductResponse> => {
    try {
        // fetch the product
        const product = await Product.findOne({ _id: productId });

        // throw an error id product is not found
        if (!product) {
            throw new HttpCustomError(404, "Product not found" );
        }
    
        return product;
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}


/**
 * Deletes a product by its ID from the database.
 *
 * @param {string} productId - The ID of the product
 * @returns {Promise<ProductResponse>} The deleted product data.
 * @throws {HttpCustomError} If the product is not found or an error occurs during deletion.
 */
export const deleteProduct = async (productId: string): Promise<ProductResponse> => {
    try {
        // fetch and delete the product using the ID
        const product = await Product.findByIdAndDelete(productId);

        // throws error if product not found
        if (!product) {
            throw new HttpCustomError(404, 'Product not found');
        }

        return product;
    } catch (error) {
        throw new HttpCustomError(error?.status || 500, error?.message || 'An unexpected error occurred');
    }
}