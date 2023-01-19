import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { userService } from '@src/services/user-service';
import { Role } from '@prisma/client';
import { UserProps } from '@src/ts/interfaces/user-props';
import { nodemailer } from '@src/lib/nodemailer';
import crypto from 'crypto';
import { hash } from 'bcrypt';

const list = async (req: Request, res: Response) => {
    const users = await userService.list();

    return res.status(200).send({
        users,
    });
};

const get = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = await userService.findById(userId);

    if (!user) {
        throw new ResponseError('No user found!', 404);
    }

    return res.status(200).send({
        user,
    });
};

const edit = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = await userService.findById(userId);

    if (!user) {
        throw new ResponseError('No user found!', 404);
    }

    const { file } = req;

    if (file && file.filename) {
        userService.updateAvatar(userId, file.filename);
    }

    const userData = req.body;
    await userService.update(userId, userData);

    return res.sendStatus(200);
};

const changeRole = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = await userService.findById(userId);

    if (!user) {
        throw new ResponseError('No user found!', 404);
    }

    const { role } = req.body;
    const roles = Object.values(Role);

    const validRole = roles.includes(role);

    if (!validRole) {
        throw new ResponseError('Invalid role', 400);
    }

    const userData = {
        role,
    } as UserProps;

    await userService.update(userId, userData);

    return res.sendStatus(200);
};

const ban = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const { motive } = req.body;

    if (!userId) {
        throw new ResponseError('Missing user Id!', 400);
    }

    if (!motive || motive === '') {
        throw new ResponseError('Missing Ban motive', 400);
    }

    const userData = {
        active: false,
    } as UserProps;

    await userService.update(userId, userData);
    await userService.ban(userId, motive);

    return res.sendStatus(200);
};

const unban = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (!userId) {
        throw new ResponseError('Missing user Id!', 400);
    }

    const userData = {
        active: true,
    } as UserProps;

    await userService.update(userId, userData);

    return res.sendStatus(200);
};

const requestEmailChange = async (req: Request, res: Response) => {
    const { id } = req.user;
    const newEmail = req.body.email;

    const emailResetHash = crypto.randomUUID();
    const encryptedHash = await hash(emailResetHash, 10);

    const nowPlusTenMinutes = new Date();
    nowPlusTenMinutes.setMinutes(nowPlusTenMinutes.getMinutes() + 10);

    await userService.updateEmailResetHash(
        id,
        newEmail,
        encryptedHash,
        nowPlusTenMinutes,
    );

    const user = await userService.findById(id);
    if (user) await nodemailer.sendEmailResetSecurityLink(user.email);
    await nodemailer.sendEmailResetLink(newEmail, emailResetHash);

    return res.sendStatus(200);
};

const emailReset = (req: Request, res: Response) => {};

export const userController = {
    list,
    get,
    edit,
    changeRole,
    ban,
    unban,
    requestEmailChange,
    emailReset,
};
