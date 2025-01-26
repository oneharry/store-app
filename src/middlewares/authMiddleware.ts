import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import BlacklistedToken from '../models/blacklistedTokenModel';
import { DecodedToken } from '../interfaces/userInterface';


export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        const isBlacklisted = isTokenBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({ error: 'Token has been invalidated, login again' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        (req as Request & { user: DecodedToken }).user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication Failed!' });
    }
};


const isTokenBlacklisted = async (token: string): Promise < boolean > => {
    const blacklistedToken = await BlacklistedToken.findOne({ token: token})
    return !!blacklistedToken;
}