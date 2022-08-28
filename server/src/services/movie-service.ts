import prisma from '@src/config/prisma-client';
import ResponseError from '@src/ts/classes/response-error';

interface MovieData {
    name: string;
    synopsis: string;
    releaseDate: string;
    country: string;
    language: string;
}

const insert = async ({
    name,
    synopsis,
    releaseDate,
    country,
    language,
}: MovieData) => {
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

const update = async () => {};

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
