import { string, number, array, date } from 'yup';

const name = string().min(2).max(100);
const synopsis = string().min(10).max(200);
const releaseDate = date();
const categories = array().of(number().min(1));
const directors = array().of(number().min(1));
const actors = array().of(number().min(1));
const languageId = number().min(1);
const countryId = number().min(1);

export const movieRules = {
    name,
    synopsis,
    releaseDate,
    categories,
    directors,
    actors,
    languageId,
    countryId,
};
