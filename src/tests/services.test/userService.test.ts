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
        jest.resetAllMocks()
    });


    describe("registerUser", () => {
        it("should successfully register a new user when email is unique", async () => {
            const userData: IUser = {
                username: "john_doe",
                email: "user@mail.com",
                password: "password",
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
                email: "user@mail.com",
                password: "password",
                role: "user",
            };

            const existingUser = { ...userData };
            // Mocking findOne, the user already exists
            (User.findOne as jest.Mock).mockResolvedValue(existingUser);

            await expect(registerUser(userData)).rejects.toThrow(
                new HttpCustomError(400, "This email is already registered. Please use a different email.")
            );
        });

        it("should throw a server error if something goes wrong during registration", async () => {
            const userData: IUser = {
                username: "john_doe",
                email: "user@mail.com",
                password: "password",
                role: "user"
            };

            const dbError = new HttpCustomError(500, "Failed to register user, try again later.");
            // Simulating bcrypt hash failure
            (bcrypt.hash as jest.Mock).mockRejectedValue(dbError);

            await expect(registerUser(userData)).rejects.toThrow(
                new HttpCustomError(500, "Failed to register user, try again later.")
            );
        });
    });

    describe("userLogin", () => {
        it("should successfully log in the user and return a token", async () => {
            const userData: UserLogin = {
                email: "user@mail.com",
                password: "password",
            };
        
            const user = {
                _id: "101",
                email: userData.email,
                password: "hashedPassword",
            };
        
            const token = "jwtTokenstring";
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Ensure bcrypt.compare works correctly
            (generateToken as jest.Mock).mockReturnValue(token);
        
            const result = await userLogin(userData);
        
            expect(result).toBe(token);
        });

        it("should throw an error if the user is not found", async () => {
            const userData: UserLogin = {
                email: "user@mail.com",
                password: "password",
            };
            // Mocking findOne to return null - user not found
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(userLogin(userData)).rejects.toThrow(
                new HttpCustomError(404, "No account found with this email.")
            );
        });

        it("should throw an error if the password is incorrect", async () => {
            const userData: UserLogin = {
                email: "user@mail.com",
                password: "password",
            };

            const user = {
                _id: "101",
                email: userData.email,
                password: "hashedPassword",
            };
            // Mocking findOne user lookup
            (User.findOne as jest.Mock).mockResolvedValue(user);
            // Mocking bcrypt password comparison failure
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userLogin(userData)).rejects.toThrow(
                new HttpCustomError(400, "Incorrect email or password")
            );
        });

        it("should throw a server error if something goes wrong during login", async () => {
            const userData: UserLogin = {
                email: "user@mail.com",
                password: "password",
            };

            const dbError = new HttpCustomError(500, "Login failed, try again later.");
            // Simulating DB failure
            (User.findOne as jest.Mock).mockRejectedValue(dbError);

            await expect(userLogin(userData)).rejects.toThrow(
                new HttpCustomError(500, "Login failed, try again later.")
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
            const dbError = new HttpCustomError(500, "An error occurred while logging out.");
            // Mocking to Simulate DB failure
            (BlacklistedToken.prototype.save as jest.Mock).mockRejectedValue(dbError);

            await expect(userLogout(token)).rejects.toThrow(
                new HttpCustomError(500, "An error occurred while logging out.")
            );
        });
    });

    describe("getCurrentUser", () => {
        it("should return the current user's details", async () => {
            const userId = "101";
            const user = { id: userId, email: "user@mail.com", username: "john_doe" };
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

            await expect(getCurrentUser(userId)).rejects.toThrow(
                new HttpCustomError(404, "User not found, login again")
            );
        });

        it("should throw a server error if something goes wrong during fetching current user", async () => {
            const userId = "101";
            const dbError = new HttpCustomError(500, "Failed to retrieve user profile, try again.");

            // Mock findOne, simulate DB failure
            (User.findOne as jest.Mock).mockRejectedValue(dbError);

            await expect(getCurrentUser(userId)).rejects.toThrow(
                new HttpCustomError(500, "Failed to retrieve user profile, try again.")
            );
        });
    });
});
