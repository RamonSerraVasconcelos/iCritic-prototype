import { string } from 'yup';

const name = string().min(2).max(100);
const synopsis = string().min(10).max(200);
const language = string().min(3).max(20);

export const movieRules = { name, synopsis, language };
