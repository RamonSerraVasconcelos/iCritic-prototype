import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { movieService } from '@src/services/movie-service';

const list = async (req: Request, res: Response) => {
    const movies = await movieService.list();

    return res.status(200).send({
        movies,
    });
};

const get = async (req: Request, res: Response) => {
    const movieId = Number(req.params.id);
    const movie = await movieService.findById(movieId);

    if (!movie) {
        throw new ResponseError('No movie found!', 404);
    }

    return res.status(200).send({
        movie,
    });
};

const edit = async (req: Request, res: Response) => {
    const movieData = req.body;
    const movie = await movieService.update(movieData);

    return res.status(200).json({
        movie,
    });
};

const add = async (req: Request, res: Response) => {
    const movie = await movieService.create(req.body);

    return res.status(201).json({
        movie,
    });
};

export const movieController = {
    list,
    get,
    edit,
    add,
};
