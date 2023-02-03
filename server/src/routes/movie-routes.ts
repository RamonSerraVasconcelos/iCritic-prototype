import { Router } from 'express';
import { validate } from '@src/middlewares/validate-middleware';
import { tryCatch } from '@src/utils/try-catch';
import { movieSchema } from '@src/schemas/movie-schema';
import movieController from '@src/controllers/movie-controller';
import { roles } from '@src/middlewares/roles-middleware';
import { Role } from '@prisma/client';

const routes = Router();

routes.post(
    '/',
    roles(Role.MODERATOR),
    validate(movieSchema.register),
    tryCatch(movieController.register),
);
routes.get('/', tryCatch(movieController.list));
routes.get('/:id', tryCatch(movieController.get));
routes.patch('/:id', roles(Role.MODERATOR), tryCatch(movieController.edit));

// Categories
routes.post(
    '/categories',
    roles(Role.MODERATOR),
    validate(movieSchema.registerCategory),
    tryCatch(movieController.registerCategory),
);
routes.patch(
    '/categories/:id',
    roles(Role.ADMIN),
    validate(movieSchema.registerCategory),
    tryCatch(movieController.editCategory),
);
routes.get('/categories/list', tryCatch(movieController.getCategories));

export default routes;
