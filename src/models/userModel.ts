import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/userInterface';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
