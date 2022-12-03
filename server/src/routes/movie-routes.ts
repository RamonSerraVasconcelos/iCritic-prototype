import { Router } from 'express';
import { validate } from '@src/middlewares/validate-middleware';
import { tryCatch } from '@src/utils/try-catch';
import { movieSchema } from '@src/schemas/movie-schema';
import { movieController } from '@src/controllers/movie-controller';

const routes = Router();

routes.get('/', tryCatch(movieController.list));
routes.get('/:id', tryCatch(movieController.get));
routes.put(
    '/:id/edit',
    validate(movieSchema.edit),
    tryCatch(movieController.edit),
);
routes.post('/add', validate(movieSchema.add), tryCatch(movieController.add));

export default routes;
