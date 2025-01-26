export interface IUser {
    username: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
    createdAt: Date;
}


export interface IBlacklistedToken {
    token: string;
    expiresAt: Date;
}

export interface DecodedToken {
    userId: string;
    email: string;
  }