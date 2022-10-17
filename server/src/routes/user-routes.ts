import { Router } from 'express';
import { validateRegister, validateUserUpdate, validateUserGet } from '@src/middlewares/validators/user-validator';
import tryCatch from '@src/utils/try-catch';
import { userAuth } from '@src/middlewares/jwt/verify-token';
import roles from '@src/middlewares/validators/role-validator';
import multer from 'multer';
import { multerConfig } from '@src/middlewares/files/multerConfig';
import userController from '@src/controllers/user-controller';

const routes = Router();

routes.post('/register', validateRegister, tryCatch(userController.register));

/**
 * Middleware to authenticate requests.
 */
routes.use(userAuth);

routes.get('/', roles('MODERATOR'), tryCatch(userController.list));
routes.get('/:id', roles('USER'), validateUserGet, tryCatch(userController.get));

routes.put('/:id', roles('USER'), validateUserUpdate, tryCatch(userController.update));

routes.post('/profilePic', roles('USER'), multer(multerConfig).single('file'), tryCatch(userController.updateProfilePic));

routes.patch('/password', roles('USER'), tryCatch(userController.updatePassword));
routes.patch('/:id/role', roles('ADMIN'), tryCatch(userController.updateRole));
routes.patch('/:id/ban', roles('MODERATOR'), tryCatch(userController.banUser));
routes.patch('/:id/unban', roles('MODERATOR'), tryCatch(userController.unbanUser));

export default routes;
