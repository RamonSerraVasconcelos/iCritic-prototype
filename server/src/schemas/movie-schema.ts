import { object } from 'yup';
import { movieRules } from '@src/schemas/rules/movie-rules';

const register = object({
    name: movieRules.name.required(),
    synopsis: movieRules.synopsis.required(),
    releaseDate: movieRules.releaseDate.required(),
    categories: movieRules.categories.required().min(1),
    directors: movieRules.directors.required().min(1),
    actors: movieRules.actors.required().min(1),
    countryId: movieRules.countryId.required(),
    languageId: movieRules.languageId.required(),
});

const registerCategory = object({
    name: movieRules.name.required(),
});

const registerDirector = object({
    name: movieRules.name.required(),
    countryId: movieRules.countryId.required(),
});

const registerActor = registerDirector;

export const movieSchema = {
    register,
    registerCategory,
    registerDirector,
    registerActor,
};
