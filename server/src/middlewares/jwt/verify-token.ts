import jwt from 'jsonwebtoken';
import env from '@src/config/env';
import ResponseError from '@src/ts/classes/response-error';
import { Request, Response, NextFunction } from 'express';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new ResponseError('Unauthorized!', 401);

    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (error) => {
        if (error) throw new ResponseError('Invalid token!', 403);
        next();
    });
};

export default verifyToken;
