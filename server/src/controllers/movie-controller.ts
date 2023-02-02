import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import movieService from '@src/services/movie-service';

const movieController = {
    async register(req: Request, res: Response) {
        const categories: Array<object> = [];

        req.body.categories.forEach((category: number) => {
            categories.push({
                categoryId: category,
            });
        });

        req.body.categories = categories;
        const movie = await movieService.create(req.body);

        if (!movie) {
            throw new ResponseError('', 500);
        }

        return res.sendStatus(201);
    },

    async list(req: Request, res: Response) {
        const movies = await movieService.list();

        return res.status(200).send({
            movies,
        });
    },

    async get(req: Request, res: Response) {
        const movieId = Number(req.params.id);
        const movie = await movieService.findById(movieId);

        if (!movie) {
            throw new ResponseError('No movie found!', 404);
        }

        return res.status(200).send({
            movie,
        });
    },

    async edit(req: Request, res: Response) {
        const movieData = req.body;
        const movie = await movieService.update(movieData);

        return res.status(200).json({
            movie,
        });
    },

    async registerCategory(req: Request, res: Response) {
        const { name } = req.body;

        const foundCategory = await movieService.findCategoryByName(name);

        if (foundCategory.length !== 0) {
            throw new ResponseError('This category is already registered', 409);
        }

        const createdCategory = await movieService.createCategory(name);

        if (!createdCategory) {
            throw new ResponseError('', 500);
        }

        return res.sendStatus(201);
    },

    async editCategory(req: Request, res: Response) {
        const categoryId = Number(req.params.id);
        const { name } = req.body;

        const foundCategory = await movieService.findCategoryByName(name);

        if (foundCategory.length !== 0) {
            throw new ResponseError('This category is already registered', 409);
        }

        const updatedCategory = await movieService.updateCategory(
            categoryId,
            name,
        );

        if (!updatedCategory) {
            throw new ResponseError('', 500);
        }

        return res.sendStatus(200);
    },

    async getCategories(req: Request, res: Response) {
        const movies = await movieService.listCategories();

        return res.status(200).json(movies);
    },
};

export default movieController;
