import { Router } from 'express';
import tryCatch from '@src/utils/try-catch';
import movieController from '@src/controllers/movie-controller';

const movieRoutes = Router();

movieRoutes.post('/create', movieController.create);
movieRoutes.post('/update', movieController.update);
movieRoutes.get('/', tryCatch(movieController.list));
movieRoutes.get('/:id', tryCatch(movieController.get));

export default movieRoutes;
