import { Router } from 'express';
import tryCatch from '@src/utils/try-catch';
import { userAuthRefresh } from '@src/middlewares/jwt/verify-token';
import validateLogin from '@src/middlewares/validators/auth-validator';
import authController from '@src/controllers/auth-controller';

const routes = Router();

routes.post('/login', validateLogin, tryCatch(authController.login));
routes.get('/logout', tryCatch(authController.logout));
routes.get('/refresh', userAuthRefresh, tryCatch(authController.refreshToken));

export default routes;
