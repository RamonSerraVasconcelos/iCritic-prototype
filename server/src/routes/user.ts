import { Router } from 'express';
import UserController from '../controllers/UserController';
import SessionController from '../controllers/SessionController';

const userRouter = Router();

userRouter.post('/register', UserController.register)
userRouter.post('/login', SessionController.login)

export default userRouter;
