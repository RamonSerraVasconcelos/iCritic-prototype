import { NextFunction, Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { env } from '@src/config/env';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userService from '@src/services/user-service';
import { ResponseError } from '@src/ts/classes/response-error';
import { nodemailer } from '@src/lib/nodemailer';
import { DecodedProps } from '@src/ts/interfaces/decoded-props';
import { UserProps } from '@src/ts/interfaces/user-props';
import { RefreshTokenProps } from '@src/ts/interfaces/refresh-token-props';

const register = async (req: Request, res: Response) => {
    const isDuplicated = await userService.findByEmail(req.body.email);

    if (isDuplicated)
        throw new ResponseError('This email is already registered', 409);

    const user = await userService.create(req.body);

    if (!user) throw new ResponseError('User not found', 404);

    return res.status(201).json({
        user,
    });
};

const login = async (req: Request, res: Response) => {
    const { cookies } = req;
    const { email, password } = req.body;

    const foundUser = await userService.findByEmail(email);
    if (!foundUser) throw new ResponseError('Invalid email or password!', 401);

    const matchingPasswords = await compare(password, foundUser.password);
    if (!matchingPasswords)
        throw new ResponseError('Invalid email or password!', 401);

    const user = {
        id: foundUser.id,
        name: foundUser.name,
    };

    const accessToken = jwt.sign(
        {
            user: {
                ...user,
                role: foundUser.role,
            },
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRE_TIME },
    );

    const newRefreshToken = jwt.sign(
        {
            user,
        },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: env.REFRESH_TOKEN_EXPIRE_TIME },
    );

    if (cookies?.refreshToken) {
        const refreshToken = cookies?.refreshToken as string;

        const foundToken = await userService.findByRefreshToken(refreshToken);
        if (!foundToken) await userService.deleteAllRefreshTokens(user.id);

        await userService.deleteRefreshToken(refreshToken);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: env.HTTPS_SECURE,
        });
    }

    await userService.createRefreshToken({
        token: newRefreshToken,
        userId: user.id,
    } as RefreshTokenProps);

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: env.HTTPS_SECURE,
        maxAge: env.ONE_DAY,
    });

    return res.status(200).json({ accessToken });
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
            secure: env.HTTPS_SECURE,
        });

        return res.sendStatus(204);
    }

    await userService.deleteRefreshToken(refreshToken);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: env.HTTPS_SECURE,
    });

    return res.sendStatus(204);
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const { cookies } = req;

    if (!cookies?.refreshToken) throw new ResponseError('Unauthorized!', 401);

    const refreshToken = cookies.refreshToken as string;

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: env.HTTPS_SECURE,
    });

    const foundUser = await userService.findByRefreshToken(refreshToken);

    // Detect reuse of refresh token
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            env.REFRESH_TOKEN_SECRET,
            async (error, decoded) => {
                if (error)
                    return next(new ResponseError('Invalid token!', 401));

                const { user } = decoded as DecodedProps;

                await userService.deleteAllRefreshTokens(user.id);
                return next();
            },
        );

        throw new ResponseError('User not found!', 401);
    }

    jwt.verify(
        refreshToken,
        env.REFRESH_TOKEN_SECRET,
        async (error, decoded) => {
            if (error) {
                await userService.deleteRefreshToken(refreshToken);
                return next(new ResponseError('Invalid token!', 403));
            }

            const { user } = decoded as DecodedProps;

            if (foundUser.id !== user.id)
                return next(new ResponseError('Invalid token!', 403));

            const accessToken = jwt.sign(
                {
                    user,
                },
                env.ACCESS_TOKEN_SECRET,
                { expiresIn: env.ACCESS_TOKEN_EXPIRE_TIME },
            );

            const newRefreshToken = jwt.sign(
                {
                    user,
                },
                env.REFRESH_TOKEN_SECRET,
                { expiresIn: env.REFRESH_TOKEN_EXPIRE_TIME },
            );

            await userService.deleteRefreshToken(refreshToken);
            await userService.createRefreshToken({
                token: newRefreshToken,
                userId: user.id,
            } as RefreshTokenProps);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: env.HTTPS_SECURE,
                maxAge: env.ONE_DAY,
            });

            return res.status(200).json({
                accessToken,
            });
        },
    );
};

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) throw new ResponseError('Email not found', 400);

    const passwordResetHash = crypto.randomUUID();
    const encryptedHash = await hash(passwordResetHash, 10);

    await userService.updatePasswordResetHash(user.id, encryptedHash);
    await nodemailer.sendPasswordResetLink(email, passwordResetHash);

    return res.sendStatus(200);
};

const resetPassword = async (req: Request, res: Response) => {
    const { passwordResetHash } = req.params;
    const email = req.query.email?.toString();
    const { password } = req.body;

    if (!email) throw new ResponseError('Email not found!', 400);

    if (!passwordResetHash)
        throw new ResponseError('Password reset hash not found!', 400);

    const user = await userService.findByResetHashPassword(email);
    if (!user) throw new ResponseError('User not found!', 400);

    if (!user.passwordResetHash)
        throw new ResponseError('No password reset was requested!', 400);

    const isResetHashValid = await compare(
        passwordResetHash,
        user.passwordResetHash,
    );
    if (!isResetHashValid) throw new ResponseError('Invalid hash!', 400);

    if (new Date() > user.passwordResetDate!) {
        await userService.updatePasswordResetHash(user.id, null);
        throw new ResponseError('Expired hash!', 401);
    }

    const isPasswordDuplicated = await compare(password, user.password);
    if (isPasswordDuplicated)
        throw new ResponseError(
            'Your new password must be different from your previous password!',
            400,
        );

    const userData = {
        password,
    } as UserProps;

    await userService.update(user.id, userData);
    await userService.updatePasswordResetHash(user.id, null);

    return res.sendStatus(200);
};

export const authController = {
    register,
    login,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
};
