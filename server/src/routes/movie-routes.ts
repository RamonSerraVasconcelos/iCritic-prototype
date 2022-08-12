import { Router } from 'express';
import tryCatch from '@src/utils/try-catch';
import validateCreation from '@src/middlewares/validators/movie-validator';
import movieController from '@src/controllers/movie-controller';

const movieRoutes = Router();

movieRoutes.post('/create', validateCreation, tryCatch(movieController.create));
movieRoutes.post('/update', tryCatch(movieController.update));
movieRoutes.get('/', tryCatch(movieController.list));
movieRoutes.get('/:id', tryCatch(movieController.get));

export default movieRoutes;
