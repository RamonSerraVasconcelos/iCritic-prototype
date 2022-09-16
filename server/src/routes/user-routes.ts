import { Router } from 'express';
import { validateRegister, validateUserUpdate, validateUserGet } from '@src/middlewares/validators/user-validator';
import tryCatch from '@src/utils/try-catch';
import { userAuth } from '@src/middlewares/jwt/verify-token';
import roles from '@src/middlewares/validators/role-validator';
import userController from '@src/controllers/user-controller';

const routes = Router();

routes.post('/register', validateRegister, tryCatch(userController.register));
routes.put('/:id', userAuth, roles('USER'), validateUserUpdate, tryCatch(userController.update));
routes.get('/', userAuth, roles('ADMIN'), tryCatch(userController.list));
routes.get('/:id', userAuth, roles('USER'), validateUserGet, tryCatch(userController.get));

export default routes;
