import { Router } from 'express';
import { userAuth } from '@src/middlewares/jwt/verify-token';
import userRoutes from '@src/routes/user-routes';
import authRoutes from './auth-routes';
import movieRoutes from './movie-routes';

const routes = Router();

routes.use(authRoutes);
routes.use('/users', userRoutes);
routes.use('/movies', userAuth, movieRoutes);

export default routes;
