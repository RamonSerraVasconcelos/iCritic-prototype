import { Request, Response } from 'express';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '@src/config/env';
import userService from '@src/services/user-service';
import ResponseError from '@src/ts/classes/response-error';

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);

    const matchingPasswords = await compare(password, user.password);

    if (!matchingPasswords)
        throw new ResponseError('Invalid email or password!', 401);

    const accessToken = jwt.sign(
        {
            userId: user.id,
            username: user.name,
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRE_TIME },
    );

    const refreshToken = jwt.sign(
        {
            userId: user.id,
            username: user.name,
        },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: env.REFRESH_TOKEN_EXPIRE_TIME },
    );

    await userService.updateRefreshToken(user.id, refreshToken);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: env.ONE_HOUR,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: env.ONE_DAY,
    });

    return res.status(201).json({
        userId: user.id,
        username: user.name,
    });
};

const logout = async (req: Request, res: Response) => {
    const { cookies } = req;

    if (!cookies?.refreshToken) throw new ResponseError('Unauthorized!', 401);

    const refreshToken = cookies.refreshToken as string;
    const user = await userService.findByRefreshToken(refreshToken);

    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        return res.sendStatus(204);
    }

    await userService.updateRefreshToken(user.id, '');

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });

    return res.sendStatus(204);
};

const refreshToken = async (req: Request, res: Response) => {
    const { cookies } = req;

    if (!cookies?.refreshToken) throw new ResponseError('Unauthorized!', 401);

    const refreshTokenCookie = cookies.refreshToken as string;
    const user = await userService.findByRefreshToken(refreshTokenCookie);

    if (!user) throw new ResponseError('User not found!', 403);

    jwt.verify(refreshTokenCookie, env.REFRESH_TOKEN_SECRET, (error) => {
        if (error) throw new ResponseError('Invalid token!', 403);

        jwt.sign(
            {
                userId: user.id,
                username: user.name,
            },
            env.ACCESS_TOKEN_SECRET,
            { expiresIn: env.ACCESS_TOKEN_EXPIRE_TIME },
        );

        return res.status(201).json({
            userId: user.id,
            username: user.name,
        });
    });
};

export default {
    login,
    logout,
    refreshToken,
};
