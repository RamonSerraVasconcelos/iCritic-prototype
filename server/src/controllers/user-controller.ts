import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { userService } from '@src/services/user-service';
import { Role } from '@prisma/client';
import { UserProps } from '@src/ts/interfaces/user-props';
import { nodemailer } from '@src/lib/nodemailer';
import crypto from 'crypto';
import { hash, compare } from 'bcrypt';

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

    const user = await userService.findById(id);
    if (user) {
        if (user.email === newEmail) {
            throw new ResponseError(
                'New email must be different from your current one!',
                400,
            );
        }
    }

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

    await nodemailer.sendEmailResetLink(newEmail, id, emailResetHash);

    return res.sendStatus(200);
};

const emailReset = async (req: Request, res: Response) => {
    const { id, emailResetHash } = req.body;

    const user = await userService.findById(Number(id));
    if (!user) throw new ResponseError('No user found!', 404);

    if (!user.emailResetHash)
        throw new ResponseError('No email change was requested!', 400);

    const isResetHashValid = await compare(emailResetHash, user.emailResetHash);
    if (!isResetHashValid) throw new ResponseError('Invalid hash!', 403);

    if (new Date() > user.emailResetDate!) {
        await userService.updateEmailResetHash(user.id, null, null, null);
        throw new ResponseError('Expired hash!', 403);
    }

    await userService.updateUserEmail(user.id, user.newEmailReset!);
    await nodemailer.sendEmailResetSecurityLink(user.email);
    await userService.updateEmailResetHash(user.id, null, null, null);

    return res.sendStatus(200);
};

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
