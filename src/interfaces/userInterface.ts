export interface IUser {
    username: string;
    role: string;
    avatar?: string;
    email: string;
    password: string;
}
export type UserLogin = Omit<IUser, 'username' | 'role' | 'avatar'>

export interface IBlacklistedToken {
    token: string;
    expiresAt: Date;
}

export type DecodedToken = {
    userId: string;
    email: string;
  }