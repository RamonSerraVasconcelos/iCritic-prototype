import { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '@src/config/env';
import crypto from 'crypto';
import userService from '@src/services/user-service';
import ResponseError from '@src/ts/classes/response-error';
import mailer from '@src/services/mailer-service';

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

    const mail = await mailer.sendMail({
        to: user.email,
        from: 'ramom_serrav@hotmail.com',
        subject: 'Password Recovery',
        html: `<h2>CHANGE YOUR PASSWORD:</h2>
                    <p><a href="${env.SERVER_URL}/reset-password?token=${passwordResetToken}" target="_blank">CHANGE PASSWORD</a></p>
        `,
    });

    if (!mail) {
        throw new ResponseError('Error generating Token', 400);
    }

    return res.status(200).send();
};

const resetPassword = async (req: Request, res: Response) => {
    const { email, token, password, confirmPassword } = req.body;

    if (!email || email === '') throw new ResponseError('Missing email', 400);

    if (!token || token === '') throw new ResponseError('Missing token', 400);

    if (!password || password === '') throw new ResponseError('Missing password', 400);

    if (!confirmPassword || confirmPassword === '') throw new ResponseError('Missing password confirmation', 400);

    if (password !== confirmPassword) throw new ResponseError("Passwords don't match", 400);

    const user = await userService.findByEmail(email);

    if (!user) throw new ResponseError('User not found', 400);

    const matchingTokens = await compare(token, user.passwordReset!);

    if (!matchingTokens) throw new ResponseError('Invalid token', 401);

    const now = Date.now();

    if (now > user.passwordResetDate!) throw new ResponseError('Expired token', 401);

    const updatedPassword = userService.updatePassword(user.id, password);

    if (!updatedPassword) throw new ResponseError('Error updating password', 500);

    return res.status(200).send();
};

export default {
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
};
