import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { env } from '@src/config/env';
import { DecodedProps } from '@src/ts/interfaces/decoded-props';

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = (
        req.headers.authorization || req.headers.Authorization
    )?.toString();

    if (!authHeader?.startsWith('Bearer '))
        throw new ResponseError('Unauthorized!', 401);

    // Grabs the token from the authorization header: "Bearer {token}"
    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) throw new ResponseError('Invalid token!', 403);
        req.user = (decoded as DecodedProps).user;
        next();
    });
};
