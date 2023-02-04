import { object } from 'yup';
import { movieRules } from '@src/schemas/rules/movie-rules';

const register = object({
    name: movieRules.name.required(),
    synopsis: movieRules.synopsis.required(),
    releaseDate: movieRules.releaseDate.required(),
    categories: movieRules.categories.required(),
    directorId: movieRules.directorId.required(),
    countryId: movieRules.countryId.required(),
    languageId: movieRules.languageId.required(),
});

const edit = register;

const registerCategory = object({
    name: movieRules.name.required(),
});

const registerDirector = object({
    name: movieRules.name.required(),
    countryId: movieRules.countryId.required(),
});

const editDirector = registerDirector;

export const movieSchema = {
    register,
    edit,
    registerCategory,
    registerDirector,
    editDirector,
};
