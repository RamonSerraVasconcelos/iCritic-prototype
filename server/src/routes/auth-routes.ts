import { Router } from 'express';
import tryCatch from '@src/utils/try-catch';
import validateLogin from '@src/middlewares/validators/auth-validator';
import authController from '@src/controllers/auth-controller';

const routes = Router();

routes.post('/login', validateLogin, tryCatch(authController.login));
routes.get('/logout', tryCatch(authController.logout));
routes.get('/refresh', tryCatch(authController.refreshToken));

export default routes;
