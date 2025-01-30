import * as bcrypt from 'bcrypt';
import User from '../../models/userModel';
import { HttpCustomError } from '../../utils/errorUtils';
import { generateToken } from '../../utils/jwtUtils';
import BlacklistedToken from '../../models/blacklistedTokenModel';
import { registerUser, userLogin, userLogout, getCurrentUser } from '../../services/userService';
import { IUser, UserLogin } from '../../types/userType';

// Mock the dependencies
jest.mock('../../models/userModel');
jest.mock('bcrypt');
jest.mock('../../utils/jwtUtils');
jest.mock('../../models/blacklistedTokenModel');

describe("User Service", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("registerUser", () => {
        it("should successfully register a new user when email is unique", async () => {
            const userData: IUser = {
                username: "john_doe",
                email: "john.doe@example.com",
                password: "password123",
                role: "user",
            };

            const hashedPassword = "hashedPassword";
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            // Mocking that no user exists with the email - null
            (User.findOne as jest.Mock).mockResolvedValue(null);
            // Mocking save user to DB
            (User.prototype.save as jest.Mock).mockResolvedValue(userData);

            const result = await registerUser(userData);

            expect(result).toHaveProperty("email", userData.email);
            expect(result).toHaveProperty("username", userData.username);
        });

        it("should throw an error if the email is already in use", async () => {
            const userData: IUser = {
                username: "john_doe",
                email: "john.doe@example.com",
                password: "password123",
                role: "user",
            };

            const existingUser = { ...userData };
            // Mocking findOne, the user already exists
            (User.findOne as jest.Mock).mockResolvedValue(existingUser);

            await expect(registerUser(userData)).rejects.toThrow(
                new HttpCustomError(400, "Email is already in use")
            );
        });

        it("should throw a server error if something goes wrong during registration", async () => {
            const userData: IUser = {
                username: "john_doe",
                email: "john.doe@example.com",
                password: "password123",
                role: "user"
            };

            const dbError = new HttpCustomError(500, "Server error");
            // Simulating bcrypt hash failure
            (bcrypt.hash as jest.Mock).mockRejectedValue(dbError);

            await expect(registerUser(userData)).rejects.toThrowError(
                new HttpCustomError(500, "Server error")
            );
        });
    });

    describe("userLogin", () => {
        it("should successfully log in the user and return a token", async () => {
            const userData: UserLogin = {
                email: "john.doe@example.com",
                password: "password123",
            };

            const user = {
                id: "user123",
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
            };

            const token = "jwtTokenstring";
            // Mocking fineOne user lookup
            (User.findOne as jest.Mock).mockResolvedValue(user);
            // Mocking bcrypt compare password comparison success
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            // Mocking JWT generation
            (generateToken as jest.Mock).mockReturnValue(token);

            const result = await userLogin(userData);

            expect(result).toBe(token);
        });

        it("should throw an error if the user is not found", async () => {
            const userData: UserLogin = {
                email: "john.doe@example.com",
                password: "password123",
            };
            // Mocking findOne to return null - user not found
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(userLogin(userData)).rejects.toThrowError(
                new HttpCustomError(404, "Profile do not exist")
            );
        });

        it("should throw an error if the password is incorrect", async () => {
            const userData: UserLogin = {
                email: "john.doe@example.com",
                password: "password123",
            };

            const user = {
                id: "user123",
                email: userData.email,
                password: await bcrypt.hash("wrongpassword", 10),
            };
            // Mocking findOne user lookup
            (User.findOne as jest.Mock).mockResolvedValue(user);
            // Mocking bcrypt password comparison failure
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userLogin(userData)).rejects.toThrowError(
                new HttpCustomError(400, "Incorrect email or password")
            );
        });

        it("should throw a server error if something goes wrong during login", async () => {
            const userData: UserLogin = {
                email: "john.doe@example.com",
                password: "password123",
            };

            const dbError = new HttpCustomError(500, "Database error");
            // Simulating DB failure
            (User.findOne as jest.Mock).mockRejectedValue(dbError);

            await expect(userLogin(userData)).rejects.toThrowError(
                new HttpCustomError(500, "Database error")
            );
        });
    });

    describe("userLogout", () => {
        it("should successfully add the token to blacklist", async () => {
            const token = "jwtTokenstring";
            // Mocking save
            (BlacklistedToken.prototype.save as jest.Mock).mockResolvedValue(undefined);

            await userLogout(token);

            expect(BlacklistedToken.prototype.save).toHaveBeenCalled();
        });

        it("should throw an error if something goes wrong during logout", async () => {
            const token = "jwtTokenstring";
            const dbError = new HttpCustomError(500, "Database error");
            // Mocking to Simulate DB failure
            (BlacklistedToken.prototype.save as jest.Mock).mockRejectedValue(dbError);

            await expect(userLogout(token)).rejects.toThrowError(
                new HttpCustomError(500, "Database error")
            );
        });
    });

    describe("getCurrentUser", () => {
        it("should return the current user's details", async () => {
            const userId = "101";
            const user = { id: userId, email: "john.doe@example.com", username: "john_doe" };
            // Mocking findOne for user lookup
            (User.findOne as jest.Mock).mockResolvedValue(user);

            const result = await getCurrentUser(userId);

            expect(result).toHaveProperty("email", user.email);
            expect(result).toHaveProperty("username", user.username);
        });

        it("should throw an error if the user is not found", async () => {
            const userId = "101";
            // Mocking user not found - null
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(getCurrentUser(userId)).rejects.toThrowError(
                new HttpCustomError(404, "User not found")
            );
        });

        it("should throw a server error if something goes wrong during fetching current user", async () => {
            const userId = "101";
            const dbError = new HttpCustomError(500, "Database error");

            // Mock findOne, simulate DB failure
            (User.findOne as jest.Mock).mockRejectedValue(dbError);

            await expect(getCurrentUser(userId)).rejects.toThrowError(
                new HttpCustomError(500, "Database error")
            );
        });
    });
});
