import { checkEmptyRequestBody, isEmpty, checkEmptyValue, hasValueMaxLength, hasValueMinLength, validateEmail } from '@src/utils/validations';
import { Request, Response, NextFunction } from 'express';
import ResponseError from '@src/ts/classes/response-error';

const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.body).forEach((key) => {
        checkEmptyValue(req.body[key]);
    });

    checkEmptyRequestBody(req);

    const { name, email, password } = req.body;
    validateEmail(email);

    if (!hasValueMinLength(name, 3)) throw new ResponseError('Username must contain 3 characters minimum!', 400);

    if (!hasValueMaxLength(name, 175)) throw new ResponseError('Username must contain 175 characters maximum!', 400);

    if (!hasValueMinLength(password, 8)) throw new ResponseError('Password must contain 8 characters minimum!', 400);

    if (!hasValueMaxLength(password, 75)) throw new ResponseError('Password must contain 75 characters maximum!', 400);

    req.body.email = req.body.email.toLowerCase();
    next();
};

const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.body).forEach((key) => {
        checkEmptyValue(req.body[key]);
    });

    checkEmptyRequestBody(req);

    req.body.id = req.params.id;
    const { id, name, email } = req.body;

    if (isEmpty(id) || !hasValueMinLength(id, 24)) {
        throw new ResponseError('Invalid Id format', 400);
    }

    if (name) {
        if (!hasValueMinLength(name, 3)) {
            throw new ResponseError('Username must contain 3 characters minimum!', 400);
        }

        if (!hasValueMaxLength(name, 175)) {
            throw new ResponseError('Username must contain 175 characters maximum!', 400);
        }
    }

    if (email) {
        validateEmail(email);
        req.body.email = req.body.email.toLowerCase();
    }

    next();
};

const validateUserGet = (req: Request, res: Response, next: NextFunction) => {
    if (isEmpty(req.params.id) || !hasValueMinLength(req.params.id, 24)) {
        throw new ResponseError('Invalid Id format', 400);
    }

    req.body.id = req.params.id;
    next();
};

export { validateRegister, validateUserUpdate, validateUserGet };
