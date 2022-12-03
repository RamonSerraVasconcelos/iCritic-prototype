import { date, number, object } from 'yup';
import { movieRules } from '@src/schemas/rules/movie-rules';

const add = object({
    name: movieRules.name.required(),
    synopsis: movieRules.synopsis.required(),
    releaseDate: date().required(),
    language: movieRules.language.required(),
    countryId: number().required(),
    requiredId: number().required(),
});

const edit = object({
    id: number().required(),
    name: movieRules.name.required(),
    synopsis: movieRules.synopsis.required(),
    releaseDate: date().required(),
    language: movieRules.language.required(),
    countryId: number().required(),
    requiredId: number().required(),
});

export const movieSchema = { add, edit };
