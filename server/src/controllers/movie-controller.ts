import { Request, Response } from 'express';
import ResponseError from '@src/ts/classes/response-error';
import movieService from '@src/services/movie-service';

const create = async (req: Request, res: Response) => {
    const movie = await movieService.insert(req.body);

    if (!movie) {
        throw new ResponseError('Something went wrong with the request', 500);
    }

    return res.status(201).json({
        movie,
    });
};

const update = async (req: Request, res: Response) => {};

const list = async (req: Request, res: Response) => {
    const movies = await movieService.find();

    if (!movies) {
        throw new ResponseError('', 204);
    }

    return res.status(200).send({
        movies,
    });
};

const get = async (req: Request, res: Response) => {};

export default {
    create,
    update,
    list,
    get,
};
