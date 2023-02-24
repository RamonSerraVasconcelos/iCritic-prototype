import { prisma } from '@src/lib/prisma';
import { MovieProps } from '@src/ts/interfaces/movie-props';
import { MovieCategory } from '@src/ts/interfaces/movie-category-props';
import { MovieDirector } from '@src/ts/interfaces/movie-director-props';

const selectMovieFields = {
    name: true,
    synopsis: true,
    releaseDate: true,
    rating: true,
    country: {
        select: {
            id: true,
            name: true,
        },
    },
    languageId: true,
    movieCategory: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
    movieDirector: {
        select: {
            director: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
};

const movieService = {
    async create(movie: MovieProps) {
        const createdMovie = await prisma.movie.create({
            data: {
                name: movie.name,
                synopsis: movie.synopsis,
                releaseDate: movie.releaseDate,
                languageId: Number(movie.languageId),
                countryId: Number(movie.countryId),
                rating: 0,
                movieCategory: {
                    createMany: {
                        data: movie.categories as Array<MovieCategory>,
                    },
                },
                movieDirector: {
                    createMany: {
                        data: movie.directors as Array<MovieDirector>,
                    },
                },
            },
            select: selectMovieFields,
        });

        return createdMovie;
    },

    async list() {
        const movies = await prisma.movie.findMany({
            select: selectMovieFields,
        });

        return movies;
    },

    async findById(movieId: number) {
        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
            select: selectMovieFields,
        });

        return movie;
    },

    async update(id: number, movie: MovieProps) {
        const updatedMovie = await prisma.movie.update({
            where: {
                id,
            },
            data: {
                name: movie.name || undefined,
                synopsis: movie.synopsis || undefined,
                releaseDate: movie.releaseDate || undefined,
                languageId: Number(movie.languageId) || undefined,
                countryId: Number(movie.countryId) || undefined,
                movieDirector: {
                    createMany: {
                        data:
                            (movie.directors as Array<MovieDirector>) ||
                            undefined,
                    },
                },
            },
            select: selectMovieFields,
        });

        return updatedMovie;
    },

    async upsertMovieCategory(movieId: number, categories: Array<number>) {
        const duplicates = await prisma.movie_Category.findMany({
            where: {
                movieId,
                categoryId: {
                    in: categories,
                },
            },
        });

        const duplicatedIds = duplicates.map((category) => category.categoryId);

        const categoriesIds = categories.filter(
            (category) => !duplicatedIds.includes(category) ?? category,
        );

        const categoriesToBeInserted = categoriesIds.map((categoryId) => {
            return { movieId, categoryId };
        });

        const insertedCategories = prisma.movie_Category.createMany({
            data: categoriesToBeInserted,
        });

        return insertedCategories;
    },

    async createCategory(name: string) {
        const category = await prisma.category.create({
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return category;
    },

    async findCategoryByName(name: string) {
        const category = await prisma.category.findMany({
            where: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return category;
    },

    async findCategoryById(categoryId: number) {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return category;
    },

    async listCategories() {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                id: 'asc',
            },
        });

        return categories;
    },

    async updateCategory(id: number, name: string) {
        const updatedCategory = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return updatedCategory;
    },

    async createDirector(name: string, countryId: number) {
        const createdDirector = await prisma.director.create({
            data: {
                name,
                countryId,
            },
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return createdDirector;
    },

    async updateDirector(directorId: number, name: string, countryId: number) {
        const updatedDirector = await prisma.director.update({
            where: {
                id: directorId,
            },
            data: {
                name: name || undefined,
                countryId: countryId || undefined,
            },
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return updatedDirector;
    },

    async listDirectors() {
        const directors = await prisma.director.findMany({
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return directors;
    },

    async findDirectorByName(name: string) {
        const director = await prisma.director.findMany({
            where: {
                name,
            },
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return director;
    },

    async findDirectorById(directorId: number) {
        const director = await prisma.director.findUnique({
            where: {
                id: directorId,
            },
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return director;
    },
};

export default movieService;
