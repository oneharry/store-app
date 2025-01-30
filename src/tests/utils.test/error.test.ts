import { handleZodError } from '../../utils/errorUtils';
import { ZodError, ZodInvalidTypeIssue } from 'zod';


describe("Error Utils", () => {
    describe("handleZodError", () => {
        it("should return the first validation error message", () => {
            // Mock ZodError with input validation errors
            
            const mockZodError = new ZodError<ZodInvalidTypeIssue>([
                { message: "Invalid email address", path: ["email"], code: "invalid_type", expected: "string", received: "undefined" },
                { message: "Password is required", path: ["password"], code: "custom" }
            ]);
    
            const result = handleZodError(mockZodError);
    
            expect(result).toBe("Invalid email address");
        });
    
        it("should handle an empty ZodError array, return undefined", () => {
            // Mocking ZodError without validation errors
            const mockZodError = new ZodError([]);
    
            const result = handleZodError(mockZodError);
    
            expect(result).toBeUndefined();
        });
    });
})
