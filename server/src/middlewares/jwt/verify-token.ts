import jwt from 'jsonwebtoken';
import env from '@src/config/env';
import { Request, Response, NextFunction } from 'express';
import { User } from '@src/ts/types';
import ResponseError from '@src/ts/classes/response-error';

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.accessToken || '';

    if (!token) throw new ResponseError('Unauthorized', 401);

    jwt.verify(token, <string>env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) throw new ResponseError('Unauthorized', 401);

        req.user = user as User;
        return next();
    });

    return next();
};

const userAuthRefresh = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken: string = req.cookies.refreshToken || '';

    if (!refreshToken) throw new ResponseError('Unauthorized', 401);

    jwt.verify(
        refreshToken,
        <string>env.REFRESH_TOKEN_SECRET,
        (error, user) => {
            if (error) throw new ResponseError('Unauthorized', 401);

            req.user = user as User;
            return next();
        },
    );

    return next();
};

export { userAuth, userAuthRefresh };
