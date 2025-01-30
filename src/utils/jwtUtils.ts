import * as jwt from 'jsonwebtoken';

// generates JWT for authentication using email and userId
// returns token on successful operations. throws error if opeation fails
export const generateToken = (userId: string, email: string): string => {
    try {
        return jwt.sign({ userId, email }, process.env.JWT_SECRET as string, { expiresIn: '12h' });
    } catch (error) {
        throw error;
    }
};
