import { excludeFields, prisma } from '@src/lib/prisma';
import { MovieProps } from '@src/ts/interfaces/movie-props';
import { MovieCategory } from '@src/ts/interfaces/movie-category-props';

const movieService = {
    async list() {
        const movies = await prisma.movie.findMany({
            select: {
                name: true,
                synopsis: true,
                releaseDate: true,
                rating: true,
                countryId: true,
                directorId: true,
                languageId: true,
                movieCategory: {
                    select: {
                        categoryId: true,
                    },
                },
            },
        });

        return movies;
    },

    async findById(movieId: number) {
        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
            select: {
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
                directorId: true,
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
            },
        });

        return movie;
    },

    async create(movie: MovieProps) {
        const createdMovie = await prisma.movie.create({
            data: {
                name: movie.name,
                synopsis: movie.synopsis,
                releaseDate: movie.releaseDate,
                languageId: Number(movie.languageId),
                countryId: Number(movie.countryId),
                directorId: Number(movie.directorId),
                rating: 0,
                movieCategory: {
                    createMany: {
                        data: movie.categories as Array<MovieCategory>,
                    },
                },
            },
        });

        return createdMovie;
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
                directorId: Number(movie.directorId) || undefined,
                movieCategory: {
                    createMany: {
                        data:
                            (movie.categories as Array<MovieCategory>) ||
                            undefined,
                    },
                },
            },
        });

        return updatedMovie;
    },

    async createCategory(name: string) {
        const category = await prisma.category.create({
            data: {
                name,
            },
        });

        return category;
    },

    async findCategoryByName(name: string) {
        const category = await prisma.category.findMany({
            where: { name },
        });

        return category;
    },

    async listCategories() {
        const categories = await prisma.category.findMany({
            orderBy: { id: 'asc' },
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
        });

        return updatedCategory;
    },
};

export default movieService;
