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
    validate(movieSchema.register),
    tryCatch(movieController.register),
);
routes.get('/', tryCatch(movieController.list));
routes.get('/:id', tryCatch(movieController.get));
routes.put('/:id', validate(movieSchema.edit), tryCatch(movieController.edit));

// Categories
routes.post(
    '/categories',
    validate(movieSchema.registerCategory),
    roles(Role.MODERATOR),
    tryCatch(movieController.registerCategory),
);
routes.put(
    '/categories/:id',
    validate(movieSchema.registerCategory),
    roles(Role.ADMIN),
    tryCatch(movieController.editCategory),
);
routes.get('/categories/list', tryCatch(movieController.getCategories));

export default routes;
