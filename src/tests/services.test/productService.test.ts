import { createProduct, updateProduct, getAllProducts, getProductById, deleteProduct } from "../../services/productService";
import { IProduct, ProductUpdate } from "../../types/productType";
import Product from "../../models/productModel";
import { HttpCustomError } from "../../utils/errorUtils";

// Mock the Product model
jest.mock("../../models/productModel");

describe("Product Service", () => {
    afterAll(() => {
        jest.resetAllMocks()
    });

    describe("createProduct", () => {
        it("should return the saved product when data is valid", async () => {
            const productData: IProduct = {
                name: "Product one",
                description: "Test product",
                price: 2500,
                quantity: 20,
            };

            const savedProduct = {
                ...productData,
                _id: "12321",
                createdAt: "2025-01-29",
                updatedAt: "2025-01-29",
            };

            // Mocking the save method of the Product model
            (Product as unknown as jest.Mock).mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(savedProduct),
            }));

            const result = await createProduct(productData);
            expect(result).toHaveProperty("name", productData.name);
            expect(result).toHaveProperty("_id");
            expect(result).toHaveProperty("price", productData.price);

        });

        it("should throw an HttpCustomError if saving fails", async () => {
            const dbError = new HttpCustomError(500, "Database error");
            const productData: IProduct = {
                name: "Product",
                description: "A test product",
                price: 2500,
                quantity: 20,
            };

            (Product as unknown as jest.Mock).mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new HttpCustomError(500, "Database error")),
            }));

            await expect(createProduct(productData)).rejects.toThrow(new HttpCustomError(500, "Database error"));
        });
    });


    describe("updateProduct", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it("should return the updated product when data is valid", async () => {
            const productId = "102";
            const productData: ProductUpdate = {
                name: "Product",
                description: "An updated info about product",
                price: 3000,
                quantity: 50,
            };

            const existingProduct = {
                _id: productId,
                name: "Product",
                description: "An existing product",
                price: 2000,
                quantity: 10,
                save: jest.fn(),
            };

            const updatedProduct = {
                ...existingProduct,
                ...productData,
            };

            // Mock findOne to return the existing product
            (Product.findOne as jest.Mock).mockResolvedValue(existingProduct);

            // Mock the save method to return the updated product
            existingProduct.save = jest.fn().mockResolvedValue(updatedProduct);

            const result = await updateProduct(productId, productData);

            expect(result).toHaveProperty("name", updatedProduct.name);
            expect(result).toHaveProperty("price", updatedProduct.price);
            expect(result).toHaveProperty("quantity", updatedProduct.quantity);
        });

        it("should throw an HttpCustomError if the product is not found", async () => {
            const productId = "102";
            const productData: ProductUpdate = {
                name: "Product",
                description: "An updated info about product",
                price: 3000,
                quantity: 50,
            };

            // Mock product not found - null
            (Product.findOne as jest.Mock).mockResolvedValue(null);

            await expect(updateProduct(productId, productData)).rejects.toThrow(
                new HttpCustomError(404, "Product not found")
            );
        });

        it("should throw an HttpCustomError if saving the updated product fails", async () => {
            const productId = "102";
            const productData: ProductUpdate = {
                name: "Product",
                description: "An updated info about product",
                price: 3000,
                quantity: 50,
            };

            const existingProduct = {
                _id: productId,
                name: "Product",
                description: "An existing product",
                price: 2000,
                quantity: 10,
                save: jest.fn(),
            };

            // Mocking findOne to return the existing product
            (Product.findOne as jest.Mock).mockResolvedValue(existingProduct);

            // Mock the save method to simulate save failure 
            existingProduct.save = jest.fn().mockRejectedValue(
                new HttpCustomError(500, "Database error")
            );

            await expect(updateProduct(productId, productData)).rejects.toThrow(
                new HttpCustomError(500, "Database error")
            );
        });
    });

    describe("getAllProducts", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });
        it("should return a list of products when products exist", async () => {
            const products = [
                { _id: "1", name: "Product One", description: "A test product one", price: 1000, quantity: 10 },
                { _id: "2", name: "Product Two", description: "A test product 2", price: 2000, quantity: 20 },
            ];

            // Mock the find method to return an array of products
            (Product.find as jest.Mock).mockResolvedValue(products);

            const result = await getAllProducts();

            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty("_id");
            expect(result[0]).toHaveProperty("name");
            expect(result[0]).toHaveProperty("price");
        });

        it("should throw an HttpCustomError if fetching products fails", async () => {
            const dbError = new HttpCustomError(500, "Database error");

            // Mock the find method to simulate db fetch failure
            (Product.find as jest.Mock).mockRejectedValue(dbError);

            await expect(getAllProducts()).rejects.toThrow(
                new HttpCustomError(500, "Database error")
            );
        });
    });

    describe("getProductById", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it("should return a product when the product is found", async () => {
            const productId = "102";
            const product = { _id: productId, name: "Product", description: "A test product", price: 1500, quantity: 30 };

            // Mock findOne method to return a product
            (Product.findOne as jest.Mock).mockResolvedValue(product);

            const result = await getProductById(productId);

            expect(result).toHaveProperty("_id", productId);
            expect(result).toHaveProperty("name", product.name);
            expect(result).toHaveProperty("price", product.price);
        });

        it("should throw an HttpCustomError if the product is not found", async () => {
            const productId = "102";

            // Mock findOne to return null (product not found)
            (Product.findOne as jest.Mock).mockResolvedValue(null);

            await expect(getProductById(productId)).rejects.toThrow(
                new HttpCustomError(404, "Product not found")
            );
        });

        it("should throw an HttpCustomError if fetching the product fails", async () => {
            const productId = "102";
            const dbError = new HttpCustomError(500, "Database error");

            // Mock findOne to simulate a failure
            (Product.findOne as jest.Mock).mockRejectedValue(dbError);

            await expect(getProductById(productId)).rejects.toThrow(
                new HttpCustomError(500, "Database error")
            );
        });
    });

    describe("Product Service - deleteProduct", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it("should return the deleted product when the product is found", async () => {
            const productId = "102";
            const product = { _id: productId, name: "Product", description: "A test product", price: 1500, quantity: 30 };

            // Mock the findByIdAndDelete method to simulate deleting and return the product
            (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(product);

            const result = await deleteProduct(productId);

            expect(result).toHaveProperty("_id", productId);
            expect(result).toHaveProperty("name", product.name);
            expect(result).toHaveProperty("price", product.price);
        });

        it("should throw an HttpCustomError if the product is not found", async () => {
            const productId = "102";

            // Mocking findByIdAndDelete to return null - product not found
            (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(deleteProduct(productId)).rejects.toThrow(
                new HttpCustomError(404, "Product not found")
            );
        });

        it("should throw an HttpCustomError if deleting the product fails", async () => {
            const productId = "102";
            const dbError = new HttpCustomError(500, "Database error");

            // Mocking findByIdAndDelete to simulate db operation failure
            (Product.findByIdAndDelete as jest.Mock).mockRejectedValue(dbError);

            await expect(deleteProduct(productId)).rejects.toThrow(
                new HttpCustomError(500, "Database error")
            );
        });
    });
});
