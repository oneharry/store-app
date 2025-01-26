export interface IUser {
    username: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
    createdAt: Date;
}