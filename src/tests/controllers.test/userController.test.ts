import { Request, Response, NextFunction } from 'express';
import { LoginSchema, RegisterUserSchema } from "../../schemas/inputValidationSchema";
import { getCurrentUser, registerUser, userLogin, userLogout } from '../../services/userService';
import { IUser } from '../../types/userType';
import { currentUser, login, logout, register } from '../../controllers/userController';
import { HttpCustomError } from '../../utils/errorUtils';


jest.mock('../../services/userService', () => ({
    registerUser: jest.fn(),
    userLogin: jest.fn(),
    userLogout: jest.fn(),
    getCurrentUser: jest.fn()
}));

jest.mock('../../schemas/inputValidationSchema', () => ({
    RegisterUserSchema: {
        parse: jest.fn()
    },
    LoginSchema: {
        parse: jest.fn()
    }
}))

describe("User Controllers", () => {
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
        jest.resetAllMocks();
    });



    describe("register", () => {
        it("should successfully register a user, return with a 201 status code", async () => {
            const user: IUser = {
                username: "Test user",
                email: "test@mail.com",
                password: "password",
                role: "user"
            };

            mockRequest.body = user;

            (RegisterUserSchema.parse as jest.Mock).mockReturnValue(user);
            (registerUser as jest.Mock).mockResolvedValue(user);

            await register(mockRequest as Request, mockResponse as Response, nextFunction);

            
            expect(RegisterUserSchema.parse).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "User registered successfully",
                data: user,
            });
        })

        it("should call next() with validation error if input is invalid", async () => {
            const validationError = new Error("Invalid input");
            (RegisterUserSchema.parse as jest.Mock).mockImplementation(() => {
                throw validationError;
            });

            await register(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(RegisterUserSchema.parse).toHaveBeenCalled();
            expect(nextFunction).toHaveBeenCalledWith(validationError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        it("should call next() with an HttpCustomError if registerUser fails", async () => {
            const serviceError = new HttpCustomError(500, "Error from service");
            const user: IUser = {
                username: "Test user",
                email: "test@mail.com",
                password: "password",
                role: "user",
            };

            mockRequest.body = user;

            // Mock validation schema
            (RegisterUserSchema.parse as jest.Mock).mockReturnValue(user);

            (registerUser as jest.Mock).mockRejectedValue(serviceError);

            await register(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(RegisterUserSchema.parse).toHaveBeenCalledWith(mockRequest.body);
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    })


    describe("login", () => {
        it("should login a user successfully", async () => {
            const userCreds = {
                email: "user@gmail.com",
                password: "password"
            };
            const token = "0987612345";

            (LoginSchema.parse as jest.Mock).mockReturnValue(userCreds);
            (userLogin as jest.Mock).mockResolvedValue(token);
            
            mockRequest.body = userCreds;
            
            await login(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(LoginSchema.parse).toHaveBeenCalledWith(mockRequest.body);
            expect(userLogin).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ token });
        });

        it("should call next() with validation error if input is invalid", async () => {
            const validationError = new Error("Invalid input");
            (LoginSchema.parse as jest.Mock).mockImplementation(() => {
                throw validationError;
            });

            await login(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(LoginSchema.parse).toHaveBeenCalled();
            expect(nextFunction).toHaveBeenCalledWith(validationError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });


        it("should call next() with an error if login fails", async () => {
            const serviceError = new HttpCustomError(500, "Service error");
            const userCreds = {
                email: "user@gmail.com",
                password: "password"
            };
            const token = "0987612345";

            mockRequest.body = userCreds;

            (LoginSchema.parse as jest.Mock).mockReturnValue(mockRequest.body);

            (userLogin as jest.Mock).mockRejectedValue(serviceError);

            await login(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(LoginSchema.parse).toHaveBeenCalled();
            expect(userLogin).toHaveBeenCalledWith(mockRequest.body);
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

    describe("logout", () => {
        it("should log out a user successfully", async () => {
            mockRequest.headers = { authorization: "Bearer 0987612345" };
            (userLogout as jest.Mock).mockResolvedValue(null);
            
            await logout(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(userLogout).toHaveBeenCalledWith("0987612345");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Logged out" });
        });

        it("should call next() with error if token is missing", async () => {
            mockRequest.headers = {};
            
            await logout(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(nextFunction).toHaveBeenCalled();
        });
    });


    describe("currentUser", () => {
        it("should get current user successfully", async () => {
            const user: IUser = {
                username: "Test user",
                email: "test@mail.com",
                password: "password",
                role: "user",
            };
            (getCurrentUser as jest.Mock).mockResolvedValue(user);
            
            mockRequest.user = { userId: "101", email: "test@mail.com" };
            
            await currentUser(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(getCurrentUser).toHaveBeenCalledWith("101");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: user });
        });

        it("should call next() with error if user is not authenticated", async () => {
            mockRequest.user = undefined;
            
            await currentUser(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(nextFunction).toHaveBeenCalled();
        });
    });

})