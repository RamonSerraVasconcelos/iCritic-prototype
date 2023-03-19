import { string } from 'yup';

const name = string().min(3).max(20);
const email = string().email().lowercase();
const password = string().min(8).max(200);
const description = string().min(10).max(200);

export const userRules = { name, email, password, description };
