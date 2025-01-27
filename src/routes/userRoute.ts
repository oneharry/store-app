import { Router } from "express";
import { currentUser, login, logout, register } from "../controllers/userController";
import { Auth } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.post('/auth/register', register);
userRouter.post('/auth/login', login);
userRouter.post('/auth/logout', Auth, logout);
userRouter.get('/user', Auth, currentUser);

export default userRouter;