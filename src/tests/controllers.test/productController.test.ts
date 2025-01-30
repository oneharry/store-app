import { Request, Response, NextFunction } from 'express';
import { addProduct, editProduct, getProduct, getProducts, removeProduct } from "../../controllers/productController";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../../services/productService";
import { CreateProductSchema, UpdateProductSchema } from "../../schemas/inputValidationSchema";
import { IProduct } from "../../types/productType";
import { HttpCustomError } from '../../utils/errorUtils';


jest.mock('../../services/productService', () => ({
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getAllProducts: jest.fn(),
    getProductById: jest.fn()
}));

jest.mock('../../schemas/inputValidationSchema', () => ({
    CreateProductSchema: {
        parse: jest.fn()
    },
    UpdateProductSchema: {
        parse: jest.fn()
    }
}))

describe("Product Controllers", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks()
    });



    describe("addProduct", () => {
        it("should add  a product to the store DB, returns 201", async () => {
            const mockedProduct: IProduct = {
                name: "Test product",
                description: 'A product for test',
                price: 1500,
                quantity: 15,
            };

            (CreateProductSchema.parse as jest.Mock).mockReturnValue(mockedProduct);
            (createProduct as jest.Mock).mockResolvedValue(mockedProduct);

            await addProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Product added successfully",
                data: mockedProduct,
            });
        })

        it("should call next() with validation error if input is invalid", async () => {
            const validationError = new Error("Invalid input");
            (CreateProductSchema.parse as jest.Mock).mockImplementation(() => {
                throw validationError;
            });

            await addProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(CreateProductSchema.parse).toHaveBeenCalled();
            expect(nextFunction).toHaveBeenCalledWith(validationError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        it("should call next() with an HttpCustomError if createProduct fails", async () => {
            const mockedProduct: IProduct = {
                name: "Test product",
                description: 'A product for test',
                price: 1500,
                quantity: 15,
            };

            mockRequest.body = mockedProduct;

            // Mock validation schema
            (CreateProductSchema.parse as jest.Mock).mockReturnValue(mockedProduct);

            // Mock service function throwing error
            const serviceError = new HttpCustomError(500, "Error from service");
            (createProduct as jest.Mock).mockRejectedValue(serviceError);

            await addProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(createProduct).toHaveBeenCalledWith(mockedProduct);
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    })


    describe("editProduct", () => {
        it("should update a product and return 200", async () => {
            const productId = "102";
            const updatedProduct: IProduct = {
                name: "Updated Product",
                description: "Updated description",
                price: 2000,
                quantity: 10,
            };

            mockRequest.params = { id: productId };
            mockRequest.body = updatedProduct;

            (UpdateProductSchema.parse as jest.Mock).mockReturnValue(updatedProduct);
            (updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

            await editProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(updateProduct).toHaveBeenCalledWith(productId, updatedProduct);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: updatedProduct });
        });

        it("should call next() with validation error if input is invalid", async () => {
            const validationError = new Error("invalid input");
            (UpdateProductSchema.parse as jest.Mock).mockImplementation(() => {
                throw validationError;
            });
            mockRequest.params = { id: '101' };

            await editProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(UpdateProductSchema.parse).toHaveBeenCalled();
            expect(nextFunction).toHaveBeenCalledWith(validationError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        it("should call next() with an error if product id is undefined ", async () => {
            mockRequest.params = {};

            await editProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        it("should call next() with an error if updateProduct fails", async () => {
            const serviceError = new HttpCustomError(500, "Service error");
            const productId = "101";
            const updatedProduct = {
                name: "Updated Product",
                description: "Updated product test description",
                price: 2000,
                quantity: 10,
            };

            mockRequest.params = { id: productId };
            mockRequest.body = updatedProduct;

            (UpdateProductSchema.parse as jest.Mock).mockReturnValue(updatedProduct);

            (updateProduct as jest.Mock).mockRejectedValue(serviceError);

            await editProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(updateProduct).toHaveBeenCalledWith(productId, updatedProduct);
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

    describe("getProducts", () => {
        it("should fetch all products and return 200", async () => {
            const products = [
                { id: "101", name: "Product test 1", price: 1000 },
                { id: "102", name: "Product test 2", price: 2000 },
            ];

            (getAllProducts as jest.Mock).mockResolvedValue(products);

            await getProducts(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(getAllProducts).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: products });
        });

        it("should call next() with an error if getAllProducts fails", async () => {
            const serviceError = new HttpCustomError(500, "Error fetching products");
            (getAllProducts as jest.Mock).mockRejectedValue(serviceError);

            await getProducts(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(getAllProducts).toHaveBeenCalled();
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });


    describe("getProduct", () => {
        it("should return a product and status 200", async () => {
            const productId = "101";
            const product = {
                id: productId,
                name: "Test product",
                description: "A test product",
                price: 1000,
                quantity: 20,
            };

            mockRequest.params = { id: productId };

            (getProductById as jest.Mock).mockResolvedValue(product);

            await getProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(getProductById).toHaveBeenCalledWith(productId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: product });
        });

        it("should call next() with an error if product id is undefined ", async () => {
            mockRequest.params = {};

            await getProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        it("should call next() with an error if getProductById fails", async () => {
            const serviceError = new HttpCustomError(500, "Service error");
            const productId = "101";

            mockRequest.params = { id: productId };
            (getProductById as jest.Mock).mockRejectedValue(serviceError);

            await getProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(getProductById).toHaveBeenCalledWith(productId);
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

    describe("removeProduct", () => {
        it("should delete a product and return 200", async () => {
            const productId = "102";
            const user = { message: "Product deleted successfully" };

            mockRequest.params = { id: productId };
            (deleteProduct as jest.Mock).mockResolvedValue(user);

            await removeProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(deleteProduct).toHaveBeenCalledWith(productId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
        });

        it("should call next() with an error if product id is undefined ", async () => {
            mockRequest.params = {};

            await removeProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        it("should call next() with an error if deleteProduct fails", async () => {
            const serviceError = new HttpCustomError(500, "Service error");
            const productId = "102";

            mockRequest.params = { id: productId };
            (deleteProduct as jest.Mock).mockRejectedValue(serviceError);

            await removeProduct(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(deleteProduct).toHaveBeenCalledWith(productId);
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

})