import { Router } from 'express';
import tryCatch from '@src/utils/try-catch';
import { userAuthRefresh } from '@src/middlewares/jwt/verify-token';
import validateLogin from '@src/middlewares/validators/auth-validator';
import authController from '@src/controllers/auth-controller';

const routes = Router();

routes.post('/login', validateLogin, tryCatch(authController.login));
routes.get('/refresh', userAuthRefresh, tryCatch(authController.refreshToken));
routes.get('/logout', userAuthRefresh, tryCatch(authController.logout));
routes.post('/forgotPassword', tryCatch(authController.forgotPassword));

export default routes;
