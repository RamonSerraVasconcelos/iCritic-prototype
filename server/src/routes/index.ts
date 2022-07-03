import { Router } from 'express';
import userRouter from './user';
import movieRouter from './movie';
import { userAuth } from '../middlewares/userAuth'

const router = Router();

router.use('/user', userRouter)
router.use('/movie', userAuth, movieRouter)

export default router;
