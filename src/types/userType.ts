export interface IUser {
    username: string;
    role: string;
    email: string;
    password: string;
}

export interface IBlacklistedToken {
    token: string;
    expiresAt: Date;
}

export type UserLogin = Omit<IUser, 'username' | 'role' | 'avatar'>

export type DecodedToken = {
    userId: string;
    email: string;
  }