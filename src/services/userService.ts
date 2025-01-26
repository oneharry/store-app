import * as bcrypt from 'bcrypt';
import User from '../models/userModel';
import { HttpCustomError } from '../middlewares/errorMiddleware';


export const registerUser = async (userData) => {
    try {
        const { username, email, password, avatar } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            avatar
        });

        return await user.save();
    } catch (error) {
        throw error;
    }
}

export const userLogin = async (userData) => {
    try {
        const { email, password } = userData;
        let user = await User.findOne({ email })
      
          if (!user) {
            throw new HttpCustomError(404, 'User not found');
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
      
          if (!isPasswordValid) {
            throw new HttpCustomError(400, 'Invalid password');
          }
      
              
          const token = jwt.sign(
            {
              userId: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
          );
    } catch (error) {
        throw error;
    }
}

export const userLogout = async (userData) => {
    try {
        const { username, email, password, avatar } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            avatar
        });

        return await user.save();
    } catch (error) {
        throw error;
    }
}

export const getCurrentUser = async (email: string) => {
    try {
        const user = await User.find({ email})
    } catch (error) {
        throw error;
    }
}

export const registerUser = async (userData) => {
    try {
        const { username, email, password, avatar } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            avatar
        });

        return await user.save();
    } catch (error) {
        throw error;
    }
}