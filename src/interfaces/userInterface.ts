
export interface IUser extends UserLogin {
    username: string;
    role: string;
    avatar?: string;
}

export interface UserLogin {
    email: string;
    password: string;
}


export interface IBlacklistedToken {
    token: string;
    expiresAt: Date;
}

export interface DecodedToken {
    userId: string;
    email: string;
  }