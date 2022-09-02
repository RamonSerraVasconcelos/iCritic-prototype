import { Router } from 'express';
import tryCatch from '@src/utils/try-catch';
import { validateCreation, validateUpdate } from '@src/middlewares/validators/movie-validator';
import movieController from '@src/controllers/movie-controller';

const movieRoutes = Router();

movieRoutes.post('/:id', validateCreation, tryCatch(movieController.create));
movieRoutes.put('/:id', validateUpdate, tryCatch(movieController.update));
movieRoutes.get('/', tryCatch(movieController.list));
movieRoutes.get('/:id', tryCatch(movieController.get));

export default movieRoutes;
