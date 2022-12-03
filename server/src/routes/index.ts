import { Router } from 'express';
import userRoutes from '@src/routes/user-routes';
import authRoutes from '@src/routes/auth-routes';
import movieRoutes from '@src/routes/movie-routes';
import { verifyToken } from '@src/middlewares/verify-token-middleware';

const routes = Router();

routes.use(authRoutes);

routes.use(verifyToken);
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);

export default routes;
