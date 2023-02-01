import { prisma } from '@src/lib/prisma';
import { MovieProps } from '@src/ts/interfaces/movie-props';

const movieService = {
    async list() {
        const movies = await prisma.movie.findMany();

        return movies;
    },

    async findById(movieId: number) {
        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
        });

        return movie;
    },

    async create(movie: MovieProps) {
        const createdMovie = await prisma.movie.create({
            data: {
                ...movie,
                rating: 0,
            },
        });

        return createdMovie;
    },

    async update(movie: MovieProps) {
        const updatedMovie = await prisma.movie.update({
            where: {
                id: movie.id,
            },
            data: {
                name: movie.name || undefined,
                synopsis: movie.synopsis || undefined,
                releaseDate: movie.releaseDate || undefined,
                language: movie.language || undefined,
                rating: movie.rating,
                countryId: movie.countryId,
                directorId: movie.directorId || undefined,
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
