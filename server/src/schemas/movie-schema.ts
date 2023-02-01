import { date, number, object } from 'yup';
import { movieRules } from '@src/schemas/rules/movie-rules';

const register = object({
    name: movieRules.name.required(),
    synopsis: movieRules.synopsis.required(),
    releaseDate: date().required(),
    language: movieRules.language.required(),
    countryId: number().required(),
});

const edit = object({
    id: number().required(),
    name: movieRules.name.required(),
    synopsis: movieRules.synopsis.required(),
    releaseDate: date().required(),
    language: movieRules.language.required(),
    countryId: number().required(),
});

const registerCategory = object({
    name: movieRules.name.required(),
});

export const movieSchema = { register, edit, registerCategory };
