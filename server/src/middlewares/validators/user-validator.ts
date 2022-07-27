import {
    checkEmptyRequestBody,
    checkEmptyValue,
    hasValueMaxLength,
    hasValueMinLength,
    validateEmail,
} from '@src/utils/validations';
import { Request, Response, NextFunction } from 'express';
import ResponseError from '@src/ts/classes/response-error';

const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.body).forEach((key) => {
        checkEmptyValue(req.body[key]);
    });

    checkEmptyRequestBody(req);

    const { name, email, password } = req.body;
    validateEmail(email);

    if (!hasValueMinLength(name, 3))
        throw new ResponseError(
            'Username must contain 3 characters minimum!',
            400,
        );

    if (!hasValueMaxLength(name, 22))
        throw new ResponseError(
            'Username must contain 22 characters maximum!',
            400,
        );

    if (!hasValueMinLength(password, 8))
        throw new ResponseError(
            'Password must contain 8 characters minimum!',
            400,
        );

    if (!hasValueMaxLength(password, 22))
        throw new ResponseError(
            'Password must contain 22 characters maximum!',
            400,
        );

    req.body.email = req.body.email.toLowerCase();
    next();
};

export default validateRegister;
