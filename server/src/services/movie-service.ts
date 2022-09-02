import prisma from '@src/config/prisma-client';

interface MovieData {
    id: string;
    name: string;
    synopsis: string;
    releaseDate: string;
    country: string;
    language: string;
}

const insert = async ({ name, synopsis, releaseDate, country, language }: MovieData) => {
    const movie = await prisma.movie.create({
        data: {
            name,
            synopsis,
            releaseDate,
            country,
            language,
            rating: 0,
            directorId: 1,
        },
    });

    return movie;
};

const update = async (movie: MovieData) => {
    const updatedMovie = await prisma.movie.update({
        where: {
            id: movie.id,
        },
        data: {
            name: movie.name || undefined,
            synopsis: movie.synopsis || undefined,
            releaseDate: movie.releaseDate || undefined,
            country: movie.country || undefined,
            language: movie.language || undefined,
        },
    });

    return updatedMovie;
};

const find = async () => {
    const movies = await prisma.movie.findMany();

    return movies;
};

const findById = async () => {};

export default {
    insert,
    update,
    find,
    findById,
};
