import * as jwt from 'jsonwebtoken';

export const generateToken = (userId: string, email: string): string => {
    try {
        return jwt.sign({ userId, email }, process.env.JWT_SECRET as string, { expiresIn: '12h' });
    } catch (error) {
        throw error;
    }
};
