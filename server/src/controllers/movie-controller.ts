import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { movieService } from '@src/services/movie-service';

const create = async (req: Request, res: Response) => {
    const movie = await movieService.insert(req.body);

    if (!movie) {
        throw new ResponseError('Something went wrong with the request', 500);
    }

    return res.status(201).json({
        movie,
    });
};

const update = async (req: Request, res: Response) => {
    const movieData = req.body;

    const movie = await movieService.update(movieData);

    if (!movie) {
        throw new ResponseError(
            'Something went wrong. Please review the movie id and its fields',
            400,
        );
    }

    return res.status(200).send();
};

const list = async (req: Request, res: Response) => {
    const movies = await movieService.list();

    if (!movies) {
        throw new ResponseError('', 204);
    }

    return res.status(200).send({
        movies,
    });
};

const get = async (req: Request, res: Response) => {
    const movieId = req.body.id;

    const movie = await movieService.findById(movieId);

    if (!movie) {
        throw new ResponseError('', 404);
    }

    return res.status(200).send({
        movie,
    });
};

export const movieController = {
    create,
    update,
    list,
    get,
};
