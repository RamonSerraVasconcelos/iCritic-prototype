import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import movieService from '@src/services/movie-service';

const movieController = {
    async register(req: Request, res: Response) {
        const movieData = req.body;
        const categories: Array<object> = [];
        const directors: Array<object> = [];

        movieData.categories.forEach((category: number) => {
            categories.push({
                categoryId: category,
            });
        });

        movieData.directors.forEach((director: number) => {
            directors.push({
                directorId: director,
            });
        });

        movieData.categories = categories;
        movieData.directors = directors;
        const movie = await movieService.create(movieData);

        return res.status(201).json(movie);
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

        return res.status(200).json(updatedMovie);
    },

    async registerCategory(req: Request, res: Response) {
        const { name } = req.body;

        const foundCategory = await movieService.findCategoryByName(name);

        if (foundCategory.length !== 0) {
            throw new ResponseError('This category is already registered', 409);
        }

        const category = await movieService.createCategory(name);

        return res.status(201).json(category);
    },

    async editCategory(req: Request, res: Response) {
        const categoryId = Number(req.params.id);
        const { name } = req.body;

        const foundCategory = await movieService.findCategoryByName(name);

        if (foundCategory.length !== 0) {
            throw new ResponseError('This category is already registered', 409);
        }

        const category = await movieService.updateCategory(categoryId, name);

        return res.status(200).json(category);
    },

    async getCategories(req: Request, res: Response) {
        const categories = await movieService.listCategories();

        return res.status(200).json(categories);
    },

    async getCategory(req: Request, res: Response) {
        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            throw new ResponseError('Invalid Id format', 400);
        }

        const category = await movieService.findCategoryById(Number(id));

        if (!category) {
            throw new ResponseError('Category not found', 404);
        }

        return res.status(200).json(category);
    },

    async registerDirector(req: Request, res: Response) {
        const { name, countryId } = req.body;

        const isDirectorDuplicated = await movieService.findDirectorByName(
            name,
        );

        if (isDirectorDuplicated.length !== 0) {
            throw new ResponseError('This director is already registered', 500);
        }

        const director = await movieService.createDirector(name, countryId);
        if (!director) {
            throw new ResponseError('', 500);
        }

        return res.status(201).json(director);
    },

    async editDirector(req: Request, res: Response) {
        const { id } = req.params;
        const { name, countryId } = req.body;

        if (Number.isNaN(Number(id))) {
            throw new ResponseError('Invalid Id format', 400);
        }

        const isDirectorDuplicated = await movieService.findDirectorByName(
            name,
        );

        if (isDirectorDuplicated.length !== 0) {
            throw new ResponseError('This director is already registered', 500);
        }

        const director = await movieService.updateDirector(
            Number(id),
            name,
            countryId,
        );

        return res.status(200).json(director);
    },

    async getDirectors(req: Request, res: Response) {
        const directors = await movieService.listDirectors();

        return res.status(200).json(directors);
    },

    async getDirector(req: Request, res: Response) {
        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            throw new ResponseError('Invalid Id format', 400);
        }

        const director = await movieService.findDirectorById(Number(id));

        if (!director) {
            throw new ResponseError('Director not found', 404);
        }

        return res.status(200).json(director);
    },
};

export default movieController;
