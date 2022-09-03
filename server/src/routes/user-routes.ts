import { Router } from 'express';
import { validateRegister, validateUserUpdate, validateUserGet } from '@src/middlewares/validators/user-validator';
import tryCatch from '@src/utils/try-catch';
import { userAuth } from '@src/middlewares/jwt/verify-token';
import userController from '@src/controllers/user-controller';

const routes = Router();

routes.post('/register', validateRegister, tryCatch(userController.register));
routes.put('/:id', userAuth, validateUserUpdate, tryCatch(userController.update));
routes.get('/', userAuth, tryCatch(userController.list));
routes.get('/:id', userAuth, validateUserGet, tryCatch(userController.get));

export default routes;
