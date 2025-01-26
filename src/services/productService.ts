import * as bcrypt from 'bcrypt';
import User from '../models/userModel';


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