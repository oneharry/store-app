import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Function to generate JWT token
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Function to verify JWT token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Return null if token is invalid
  }
};
