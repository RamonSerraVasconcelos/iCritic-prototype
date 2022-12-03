import { Router } from 'express';
import { validate } from '@src/middlewares/validate-middleware';
import { tryCatch } from '@src/utils/try-catch';
import { movieSchema } from '@src/schemas/movie-schema';
import { movieController } from '@src/controllers/movie-controller';

const routes = Router();

routes.post(
    '/:movieId',
    validate(movieSchema.create),
    tryCatch(movieController.create),
);
routes.put(
    '/:movieId',
    validate(movieSchema.update),
    tryCatch(movieController.update),
);
routes.get('/', tryCatch(movieController.list));
routes.get('/:movieId', tryCatch(movieController.get));

export default routes;
