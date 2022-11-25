import prisma from '@src/config/prisma-client';
import { MovieProps } from '@src/ts/interfaces/movie-props';

const insert = async ({ name, synopsis, releaseDate, language, countryId, directorId }: MovieProps) => {
    const movie = await prisma.movie.create({
        data: {
            name,
            synopsis,
            releaseDate,
            language,
            rating: 0,
            countryId: Number(countryId),
            directorId: Number(directorId),
        },
    });

    return movie;
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

const findById = async (id: number) => {
    const movie = await prisma.movie.findUnique({
        where: { id: Number(id) },
    });

    return movie;
};

export default {
    insert,
    update,
    list,
    findById,
};
