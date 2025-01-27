import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import BlacklistedToken from '../models/blacklistedTokenModel';
import { DecodedToken } from '../interfaces/userInterface';

declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(401).json({ error: 'You are currently logged out, login again' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        (req as Request & { user: DecodedToken }).user = decodedToken;
        next(); 
    } catch (error) {
        res.status(401).json({ error: error?.message });
    }
};


const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    const blacklistedToken = await BlacklistedToken.findOne({ token: token })
    return !!blacklistedToken;
}