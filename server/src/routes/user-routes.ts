import { Router } from 'express';
import validateRegister from '@src/middlewares/validators/user-validator';
import tryCatch from '@src/utils/try-catch';
import userController from '@src/controllers/user-controller';

const routes = Router();

routes.post('/register', validateRegister, tryCatch(userController.register));

export default routes;
