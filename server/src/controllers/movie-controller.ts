import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import movieService from '@src/services/movie-service';

const movieController = {
    async register(req: Request, res: Response) {
        const movieData = req.body;
        const categories: Array<object> = [];

        movieData.categories.forEach((category: number) => {
            categories.push({
                categoryId: category,
            });
        });

        movieData.categories = categories;
        const movie = await movieService.create(movieData);

        if (!movie) {
            throw new ResponseError('', 500);
        }

        return res.sendStatus(201);
    },

    async list(req: Request, res: Response) {
        const movies = await movieService.list();

        return res.status(200).json({
            movies,
        });
    },

    async get(req: Request, res: Response) {
        const movieId = Number(req.params.id);
        const movie = await movieService.findById(movieId);

        if (!movie) {
            throw new ResponseError('Movie not found!', 404);
        }

        return res.status(200).json({
            movie,
        });
    },

    async edit(req: Request, res: Response) {
        if (Object.keys(req.body).length === 0) {
            throw new ResponseError('No data informed!', 400);
        }

        const { id } = req.params;
        const movieData = req.body;
        const categories: Array<object> = [];

        const originalMovie = await movieService.findById(Number(id));
        if (!originalMovie) {
            throw new ResponseError('Movie not found!', 404);
        }

        if (categories.length > 0) {
            movieData.categories.forEach((category: number) => {
                categories.push({
                    categoryId: category,
                });
            });
        }

        movieData.categories = categories;
        const updatedMovie = await movieService.update(Number(id), movieData);

        if (!updatedMovie) {
            throw new ResponseError('', 500);
        }

        return res.sendStatus(200);
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
        const categories = await movieService.listCategories();

        return res.status(200).json(categories);
    },
};

export default movieController;
