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
routes.get('/:userId', tryCatch(userController.get));
routes.put(
    '/:userId/update',
    validate(userSchema.update),
    tryCatch(userController.update),
);
routes.patch('/password', tryCatch(userController.updatePassword));
routes.patch(
    '/:userId/role',
    roles(Role.ADMIN),
    tryCatch(userController.updateRole),
);

// User image upload
routes.post(
    '/image',
    uploadImage.single('file'),
    tryCatch(userController.updateImage),
);

// User banishment
routes.patch(
    '/:userId/ban',
    roles(Role.ADMIN, Role.MODERATOR),
    tryCatch(userController.ban),
);
routes.patch(
    '/:userId/unban',
    roles(Role.ADMIN, Role.MODERATOR),
    tryCatch(userController.unban),
);

export default routes;
