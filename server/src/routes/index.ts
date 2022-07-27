import { Router } from 'express';
import userRoutes from '@src/routes/user-routes';
import authRoutes from './auth-routes';

const routes = Router();

routes.use(authRoutes);
routes.use('/users', userRoutes);

export default routes;
