import * as request from 'supertest';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { Auth } from '../../middlewares/authMiddleware';
import BlacklistedToken from '../../models/blacklistedTokenModel';

// Mock the BlacklistedToken model, jwt.verify methods
jest.mock('jsonwebtoken');
jest.mock('../../models/blacklistedTokenModel');

describe("Middleware", () => {
    describe('Auth Middleware', () => {
        let app: express.Application;

        // Setup the express app with the Auth middleware
        // Apply the Auth middleware
        beforeEach(() => {
            app = express();
            app.use(Auth);
            app.get('/api/products', (req, res) => {
                res.status(200).send('Access granted');
            });
        });

        afterAll(() => {
            jest.resetAllMocks()
        });

        it('should return 401 if Authorization header is missing', async () => {
            const response = await request(app).get('/api/products');
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Authorization header missing');
        });

        it('should return 401 if token is blacklisted', async () => {
            const token = 'validBlacklistedToken';

            // Mock the findOne method to simulate token is blacklisted
            (BlacklistedToken.findOne as jest.Mock).mockResolvedValueOnce({ token });

            const response = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('You are currently logged out, login again');
        });

        it('should return 401 if token is invalid', async () => {
            const token = 'invalidToken';

            // Mock the verify method to throw an error
            (jwt.verify as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });

            const response = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid token');
        });

        it('should call next() if token is valid and not blacklisted', async () => {
            const token = 'validToken';
            const decodedToken = { userId: '12345', email: 'user@example.com' };

            // Mock the findOne method for token not blacklisted - return null 
            (BlacklistedToken.findOne as jest.Mock).mockResolvedValueOnce(null);

            // Mock the jwt.verify method to return a decoded token
            (jwt.verify as jest.Mock).mockReturnValueOnce(decodedToken);

            const response = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);

            // Check that the user is decoded and passed through the middleware
            expect(response.status).toBe(200);
            expect(response.text).toBe('Access granted');
        });
    });
})
