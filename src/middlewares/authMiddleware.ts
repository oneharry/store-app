import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import BlacklistedToken from '../models/blacklistedTokenModel';
import { DecodedToken } from '../types/userType';

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
            res.status(401).json({ error: "Authorization header missing" });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "Missing authorization token" });
            return;
        }


        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(403).json({ error: "Token is no longer valid"});
            return
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        (req as Request & { user: DecodedToken }).user = decodedToken;
        next(); 
    } catch (error) {
        res.status(401).json({ error: error?.message || "Authentication failed!"});
    }
};


export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    const blacklistedToken = await BlacklistedToken.findOne({ token: token })
    return !!blacklistedToken;
}

