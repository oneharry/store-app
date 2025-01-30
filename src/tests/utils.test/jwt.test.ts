import * as jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/jwtUtils';

// mock the jwt.sign method
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe("JWT Utils", () => {
    describe("generateToken", () => {
        const mockUserId = "12345";
        const mockEmail = "test@example.com";
        const mockJwtSecret = "secret";
        const mockToken = "mockJwtToken";
    
        beforeAll(() => {
            // mocking jwt.sign to return a mock token
            (jwt.sign as jest.Mock).mockReturnValue(mockToken);
            process.env.JWT_SECRET = "mockJWTSecret";
        });
    
        it("should generate a JWT token with valid data", () => {
            const token = generateToken(mockUserId, mockEmail);
    
            // Expect jwt.sign to be called with the correct parameters
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUserId, email: mockEmail },
                process.env.JWT_SECRET,
                { expiresIn: '12h' }
            );
    
            expect(token).toBe(mockToken);
        });
    
        it("should throw an error if token generation fails", () => {
            // Mock jwt.sign to throw an error
            (jwt.sign as jest.Mock).mockImplementationOnce(() => {
                throw new Error("Token generation failed");
            });
    
            expect(() => generateToken(mockUserId, mockEmail)).toThrowError("Token generation failed");
        });
    });
})
