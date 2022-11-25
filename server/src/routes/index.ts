import { Router } from 'express';
import { userAuth } from '@src/middlewares/jwt/verify-token';
import userRoutes from '@src/routes/user-routes';
import authRoutes from './auth-routes';
import movieRoutes from './movie-routes';

const routes = Router();

// User authentication.
routes.use(authRoutes);
routes.use('/users', userRoutes);

// Middleware to authenticate requests.
routes.use(userAuth);

// Movies routes
routes.use('/movies', movieRoutes);

export default routes;
