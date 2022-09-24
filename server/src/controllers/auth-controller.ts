import { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '@src/config/env';
import crypto from 'crypto';
import userService from '@src/services/user-service';
import ResponseError from '@src/ts/classes/response-error';

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);

    if (!user) throw new ResponseError('Invalid email or password!', 401);

    const matchingPasswords = await compare(password, user.password);

    if (!matchingPasswords) throw new ResponseError('Invalid email or password!', 401);

    const accessToken = jwt.sign(
        {
            id: user.id,
            name: user.name,
            role: user.role,
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRE_TIME },
    );

    const refreshToken = jwt.sign(
        {
            id: user.id,
            name: user.name,
            role: user.role,
        },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: env.REFRESH_TOKEN_EXPIRE_TIME },
    );

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: env.HTTP_SECURE,
        maxAge: env.ONE_HOUR,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: env.HTTP_SECURE,
        maxAge: env.ONE_DAY,
    });

    return res.status(201).json({
        id: user.id,
        name: user.name,
    });
};

const refreshToken = async (req: Request, res: Response) => {
    const { user } = req;
    const accessToken = jwt.sign(
        {
            id: user.id,
            name: user.name,
            role: user.role,
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRE_TIME },
    );

    res.cookie('accessToken', accessToken, {
        sameSite: 'none',
        secure: env.HTTP_SECURE,
        httpOnly: true,
    });

    return res.status(200).send({
        user,
    });
};

const logout = async (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: env.HTTP_SECURE,
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: env.HTTP_SECURE,
    });

    return res.sendStatus(204);
};

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) throw new ResponseError('No email informed', 400);

    const user = await userService.findByEmail(email);

    if (!user) throw new ResponseError('Email not found', 400);

    const passwordResetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = await hash(passwordResetToken, 10);

    const expirationDate = Date.now() + 600000; // 10 minutes converted to miliseconds

    req.body.id = user.id;
    req.body.passwordReset = hashedToken;
    req.body.passwordResetDate = expirationDate;

    if (!(await userService.update(req.body))) {
        throw new ResponseError('Error generating Token', 400);
    }

    return res.status(200).send();
};

export default {
    login,
    refreshToken,
    logout,
    forgotPassword,
};
