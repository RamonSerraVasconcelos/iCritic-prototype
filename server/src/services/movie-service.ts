import { prisma } from '@src/lib/prisma';
import { MovieProps } from '@src/ts/interfaces/movie-props';
import { MovieCategory } from '@src/ts/interfaces/movie-category-props';
import { MovieDirector } from '@src/ts/interfaces/movie-director-props';
import { MovieActor } from '@src/ts/interfaces/movie-actor-props';

const selectMovieFields = {
    id: true,
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
    movieActor: {
        select: {
            actor: {
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
                movieActor: {
                    createMany: {
                        data: movie.actors as Array<MovieActor>,
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
            },
            select: selectMovieFields,
        });

        return updatedMovie;
    },

    async upsertMovieCategory(movieId: number, categories: Array<number>) {
        const existingCategories = await prisma.movie_Category.findMany({
            where: {
                movieId,
            },
        });

        const existingCategoriesIds = existingCategories.map((category) => category.categoryId);

        const duplicatedIds = existingCategoriesIds.filter((categoryId) => categories.includes(categoryId));
        const excludedIds = existingCategoriesIds.filter((categoryId) => !categories.includes(categoryId));

        const categoriesIds = categories.filter((category) => !duplicatedIds.includes(category) ?? category);
        const categoriesToBeInserted = categoriesIds.map((categoryId) => {
            return { movieId, categoryId };
        });

        const insertedCategories = await prisma.movie_Category.createMany({
            data: categoriesToBeInserted,
        });

        await prisma.movie_Category.deleteMany({
            where: {
                movieId,
                categoryId: {
                    in: excludedIds,
                },
            },
        });

        return insertedCategories;
    },

    async upsertMovieDirector(movieId: number, directors: Array<number>) {
        const existingDirectors = await prisma.movie_Director.findMany({
            where: {
                movieId,
            },
        });

        const existingDirectorsIds = existingDirectors.map((director) => director.directorId);

        const duplicatedIds = existingDirectorsIds.filter((directorId) => directors.includes(directorId));
        const excludedIds = existingDirectorsIds.filter((directorId) => !directors.includes(directorId));

        const directorsIds = directors.filter((director) => !duplicatedIds.includes(director) ?? director);
        const directorsToBeInserted = directorsIds.map((directorId) => {
            return { movieId, directorId };
        });

        const insertedDirectors = prisma.movie_Director.createMany({
            data: directorsToBeInserted,
        });

        await prisma.movie_Director.deleteMany({
            where: {
                movieId,
                directorId: {
                    in: excludedIds,
                },
            },
        });

        return insertedDirectors;
    },

    async upsertMovieActor(movieId: number, actors: Array<number>) {
        const duplicates = await prisma.movie_Actor.findMany({
            where: {
                movieId,
                actorId: {
                    in: actors,
                },
            },
        });

        const duplicatedIds = duplicates.map((actor) => actor.actorId);

        const actorsIds = actors.filter((actor) => !duplicatedIds.includes(actor) ?? actor);

        const actorsToBeInserted = actorsIds.map((actorId) => {
            return { movieId, actorId };
        });

        const insertedActors = prisma.movie_Actor.createMany({
            data: actorsToBeInserted,
        });

        return insertedActors;
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

    async createActor(name: string, countryId: number) {
        const actor = await prisma.actor.create({
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

        return actor;
    },

    async updateActor(actorId: number, name: string, countryId: number) {
        const updatedActor = await prisma.actor.update({
            where: {
                id: actorId,
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

        return updatedActor;
    },

    async listActors() {
        const actors = await prisma.actor.findMany({
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

        return actors;
    },

    async findActorByName(name: string) {
        const actor = prisma.actor.findMany({
            where: {
                name: name || '',
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

        return actor;
    },

    async findActorById(actorId: number) {
        const actor = prisma.actor.findUnique({
            where: {
                id: actorId,
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

        return actor;
    },
};

export default movieService;
