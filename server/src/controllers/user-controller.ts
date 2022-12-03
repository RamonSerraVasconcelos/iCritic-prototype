import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { userService } from '@src/services/user-service';
import { Role } from '@prisma/client';
import { UserProps } from '@src/ts/interfaces/user-props';

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

export const userController = {
    list,
    get,
    edit,
    changeRole,
    ban,
    unban,
};
