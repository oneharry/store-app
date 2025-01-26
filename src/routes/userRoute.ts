import { Router } from "express";

const userRouter = Router();

userRouter.post('/register')
userRouter.post('/login')
userRouter.post('/logout')
userRouter.post('/forgot-password')

export default userRouter;