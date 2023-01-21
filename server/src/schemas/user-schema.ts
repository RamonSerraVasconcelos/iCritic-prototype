import { number, object } from 'yup';
import { userRules } from '@src/schemas/rules/user-rules';

const edit = object({
    name: userRules.name,
    email: userRules.email,
    description: userRules.description,
    countryId: number(),
});

const emailValidation = object({
    email: userRules.email.required(),
});

export const userSchema = { edit, emailValidation };
