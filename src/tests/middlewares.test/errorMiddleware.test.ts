import { ZodError } from 'zod';
import { errorMiddleware } from '../../middlewares/errorMiddleware';
import { HttpCustomError } from '../../utils/errorUtils';
import { handleZodError } from '../../utils/errorUtils';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../utils/errorUtils', () => ({
    ...jest.requireActual('../../utils/errorUtils'),
    handleZodError: jest.fn(),
}));

describe('Error Middleware', () => {

    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    afterAll(() => {
        jest.resetAllMocks()
    });

    it('should handle HttpCustomError and send correct response', () => {
        const error = new HttpCustomError(400, "Bad Request");
        const next: NextFunction = jest.fn();

        errorMiddleware(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Bad Request" });
    
    });

    it('should handle input validation ZodError and send correct response', () => {
        const zodError = new ZodError([
            { message: "Name is required", path: ["email"], code: "invalid_type", expected: "string", received: "undefined" }
        ]);

        // Mock the handleZodError function to return a validation error message
        (handleZodError as jest.Mock).mockReturnValue("Name is required");

        errorMiddleware(zodError, req as Request, res as Response, next);

        expect(handleZodError).toHaveBeenCalledWith(zodError);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Name is required" });
    
    });
});
