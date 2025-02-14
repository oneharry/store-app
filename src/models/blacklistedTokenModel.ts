import mongoose, { Schema } from 'mongoose';
import { IBlacklistedToken } from '../types/userType';

const blacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    token: { type: String, required: true, unique: true  },
    expiresAt: { type: Date, required: true },
  }
);


const BlacklistedToken = mongoose.model<IBlacklistedToken>('BlacklistedToken', blacklistedTokenSchema);

export default BlacklistedToken;
