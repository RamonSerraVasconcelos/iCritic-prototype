import { checkEmptyRequestBody, validateEmail } from '@src/utils/validations';
import { Request, Response, NextFunction } from 'express';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    checkEmptyRequestBody(req);
    validateEmail(req.body.email);

    req.body.email = req.body.email.toLowerCase();
    next();
};

export default validateLogin;
