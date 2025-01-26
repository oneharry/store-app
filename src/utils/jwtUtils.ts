import * as jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });
};


export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
