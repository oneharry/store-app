import * as jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/jwtUtils';

// mock the jwt.sign method
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe("JWT Utils", () => {
    afterAll(() => {
        jest.resetAllMocks()
    });

    describe("generateToken", () => {
        const userId = "102";
        const email = "user@mail.com";
        const token = "mockJwtToken";

        beforeAll(() => {
            (jwt.sign as jest.Mock).mockReturnValue(token);
            process.env.JWT_SECRET = "mockJWTSecret";
        });

        afterAll(() => {
            jest.restoreAllMocks();
            jest.clearAllMocks();
            jest.resetModules();
        });

        it("should generate a JWT token with valid data", () => {
            const token = generateToken(userId, email);

            // Expect jwt.sign to be called with the correct parameters
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: userId, email: email },
                process.env.JWT_SECRET,
                { expiresIn: '12h' }
            );

            expect(token).toBe(token);
        });

        it("should throw an error if token generation fails", () => {
            // Mock jwt.sign to throw an error
            (jwt.sign as jest.Mock).mockImplementationOnce(() => {
                throw new Error("Token generation failed");
            });

            expect(() => generateToken(userId, email)).toThrow("Token generation failed");
        });
    });
})
