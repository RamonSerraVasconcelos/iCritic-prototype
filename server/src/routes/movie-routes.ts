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
routes.get('/categories/list', tryCatch(movieController.getCategories));
routes.get('/categories/:id', tryCatch(movieController.getCategory));
routes.patch(
    '/categories/:id',
    roles(Role.ADMIN),
    validate(movieSchema.registerCategory),
    tryCatch(movieController.editCategory),
);

// Directors
routes.post(
    '/directors',
    roles(Role.MODERATOR),
    validate(movieSchema.registerDirector),
    tryCatch(movieController.registerDirector),
);
routes.get('/directors/list', movieController.getDirectors);
routes.get('/directors/:id', tryCatch(movieController.getDirector));
routes.patch(
    '/directors/:id',
    roles(Role.MODERATOR),
    validate(movieSchema.editDirector),
    tryCatch(movieController.editDirector),
);

// Actors
routes.post(
    '/actors',
    roles(Role.MODERATOR),
    validate(movieSchema.registerActor),
    tryCatch(movieController.registerActor),
);
routes.get('/actors/list', movieController.getActors);
routes.get('/actors/:id', tryCatch(movieController.getActor));
routes.patch(
    '/actors/:id',
    roles(Role.MODERATOR),
    validate(movieSchema.editActor),
    tryCatch(movieController.editActor),
);

export default routes;
