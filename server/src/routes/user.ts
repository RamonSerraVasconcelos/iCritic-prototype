import { Router } from 'express';
import { userAuth, userAuthRefresh } from '../middlewares/userAuth'
import UserController from '../controllers/UserController';
import SessionController from '../controllers/SessionController';

const userRouter = Router();

userRouter.post('/register', UserController.register)
userRouter.post('/login', SessionController.login)
userRouter.post('/refresh', userAuthRefresh, SessionController.refresh)

export default userRouter;
