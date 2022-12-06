import { prisma } from '@src/lib/prisma';
import { MovieProps } from '@src/ts/interfaces/movie-props';

const list = async () => {
    const movies = await prisma.movie.findMany();

    return movies;
};

const findById = async (movieId: number) => {
    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    });

    return movie;
};

const create = async (movie: MovieProps) => {
    const createdMovie = await prisma.movie.create({
        data: {
            ...movie,
            rating: 0,
        },
    });

    return createdMovie;
};

const update = async (movie: MovieProps) => {
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
};

export const movieService = {
    list,
    findById,
    create,
    update,
};
