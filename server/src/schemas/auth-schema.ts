import { object, number } from 'yup';
import { userRules } from '@src/schemas/rules/user-rules';

const register = object({
    name: userRules.name.required(),
    email: userRules.email.required(),
    password: userRules.password.required(),
    description: userRules.description,
    countryId: number().required(),
});

const login = object({
    email: userRules.email.required(),
    password: userRules.password.required(),
});

const forgotPassword = object({
    email: userRules.email.required(),
});

const resetPassword = object({
    password: userRules.password.required(),
});

export const authSchema = { register, login, forgotPassword, resetPassword };
