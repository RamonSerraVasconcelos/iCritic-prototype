import { Router } from 'express';
import { validate } from '@src/middlewares/validate-middleware';
import { tryCatch } from '@src/utils/try-catch';
import { userSchema } from '@src/schemas/user-schema';
import { userController } from '@src/controllers/user-controller';
import { roles } from '@src/middlewares/roles-middleware';
import { uploadImage } from '@src/middlewares/upload-image-middleware';
import { Role } from '@prisma/client';

const routes = Router();

routes.get('/', tryCatch(userController.list));
routes.get('/:id', tryCatch(userController.get));
routes.put(
    '/:id/edit',
    validate(userSchema.edit),
    uploadImage.single('file'),
    tryCatch(userController.edit),
);

routes.patch(
    '/:id/role',
    roles(Role.ADMIN),
    tryCatch(userController.changeRole),
);

// User banishment
routes.patch('/:id/ban', roles(Role.MODERATOR), tryCatch(userController.ban));
routes.patch(
    '/:id/unban',
    roles(Role.MODERATOR),
    tryCatch(userController.unban),
);

// Emails reset
routes.post(
    '/request-email-change',
    validate(userSchema.emailValidation),
    tryCatch(userController.requestEmailChange),
);

routes.get('/email-reset/:emailResetHash', tryCatch(userController.emailReset));

export default routes;
