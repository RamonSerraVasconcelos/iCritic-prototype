import { checkEmptyRequestBody, isEmpty, checkEmptyValue, hasValueMinLength, validateDate, validateNumber } from '@src/utils/validations';
import { Request, Response, NextFunction } from 'express';
import ResponseError from '@src/ts/classes/response-error';

const validateCreation = (req: Request, res: Response, next: NextFunction) => {
    checkEmptyRequestBody(req);

    Object.keys(req.body).forEach((key) => {
        checkEmptyValue(req.body[key]);
    });

    const { name, synopsis, releaseDate, country, language, directorId } = req.body;

    if (isEmpty(name) || isEmpty(synopsis) || isEmpty(releaseDate) || isEmpty(country) || isEmpty(language)) {
        throw new ResponseError('Missing fields in request', 400);
    }

    if (!hasValueMinLength(name, 1)) {
        throw new ResponseError('Name must contain 1 character minimum', 400);
    }

    if (!hasValueMinLength(synopsis, 5)) {
        throw new ResponseError('Synopsis must contain 5 characters minimum', 400);
    }

    if (!validateDate(releaseDate)) {
        throw new ResponseError('Invalid release date', 400);
    }

    if (!validateNumber(country)) {
        throw new ResponseError('Incorret value for country id', 400);
    }

    if (!validateNumber(language)) {
        throw new ResponseError('Incorret value for language id', 400);
    }

    if (!validateNumber(directorId)) {
        throw new ResponseError('Incorret value for director id', 400);
    }

    next();
};

const validateUpdate = (req: Request, res: Response, next: NextFunction) => {
    checkEmptyRequestBody(req);

    Object.keys(req.body).forEach((key) => {
        checkEmptyValue(req.body[key]);
    });

    const { id, name, synopsis, releaseDate, country, language, directorId } = req.body;

    if (isEmpty(id) || !hasValueMinLength(id, 24)) {
        throw new ResponseError('Invalid Id format', 400);
    }

    if (name && !hasValueMinLength(name, 1)) {
        throw new ResponseError('Name must contain 1 character minimum', 400);
    }

    if (synopsis && !hasValueMinLength(synopsis, 5)) {
        throw new ResponseError('Synopsis must contain 5 characters minimum', 400);
    }

    if (releaseDate && !validateDate(releaseDate)) {
        throw new ResponseError('Invalid release date', 400);
    }

    if (country && !validateNumber(country)) {
        throw new ResponseError('Incorret value for country id', 400);
    }

    if (language && !validateNumber(language)) {
        throw new ResponseError('Incorret value for language id', 400);
    }

    if (directorId && !validateNumber(directorId)) {
        throw new ResponseError('Incorret value for director id', 400);
    }

    next();
};

export { validateCreation, validateUpdate };
