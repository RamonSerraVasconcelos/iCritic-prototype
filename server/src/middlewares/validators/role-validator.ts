import { Request, Response, NextFunction } from 'express';
import ResponseError from '@src/ts/classes/response-error';

const roles = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user.role || Object.keys(req.user.role).length === 0) {
            throw new ResponseError('Missing user role', 403);
        }

        if (req.user.role !== 'ADMIN' && role !== req.user.role) {
            throw new ResponseError('', 403);
        }

        next();
    };
};

export default roles;
