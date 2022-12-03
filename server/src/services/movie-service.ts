import { prisma } from '@src/config/prisma-client';
import { MovieProps } from '@src/ts/interfaces/movie-props';

const insert = async (movie: MovieProps) => {
    const createdMovie = await prisma.movie.create({
        data: {
            ...movie,
            rating: 0,
            countryId: Number(movie.countryId),
            directorId: Number(movie.directorId),
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
            countryId: Number(movie.countryId) || undefined,
            directorId: Number(movie.directorId) || undefined,
        },
    });

    return updatedMovie;
};

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

export const movieService = {
    insert,
    update,
    list,
    findById,
};
