import { Request, Response } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { userService } from '@src/services/user-service';

const ROLES = ['USER', 'MODERATOR', 'ADMIN'];

const update = async (req: Request, res: Response) => {
    if (Number(req.params.id) !== req.user.id) {
        throw new ResponseError("You cannot edit another user's info", 403);
    }

    if (!userService.update(req.body)) {
        throw new ResponseError(
            'Please review the user id and its fields',
            400,
        );
    }

    return res.status(200).send();
};

const updatePassword = async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;

    if (!password || password === '')
        throw new ResponseError('Missing password', 400);

    if (!confirmPassword || confirmPassword === '')
        throw new ResponseError('Missing password confirmation', 400);

    if (password !== confirmPassword)
        throw new ResponseError("Passwords don't match", 400);

    const user = await userService.findById(req.user.id);

    if (!user) throw new ResponseError('User not found', 404);

    const updatedPassword = await userService.updatePassword(
        req.user.id,
        password,
    );

    if (!updatedPassword)
        throw new ResponseError('Error updating password', 400);

    return res.status(200).send();
};

const list = async (req: Request, res: Response) => {
    const users = await userService.list();

    if (!users) {
        throw new ResponseError('', 204);
    }

    return res.status(200).send({
        users,
    });
};

const get = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const user = await userService.findById(userId);

    if (!user) {
        throw new ResponseError('', 404);
    }

    return res.status(200).send({
        user,
    });
};

const updateImage = async (req: Request, res: Response) => {
    const { file } = req;

    if (!file || !file.filename || file.filename === '') {
        throw new ResponseError('Error saving the file', 400);
    }

    userService.updateImage(req.user.id, file.filename);

    return res.sendStatus(200);
};

const updateRole = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ResponseError('Missing User Id', 400);
    }

    const { role } = req.body;

    if (!role || role === '') {
        throw new ResponseError('Missing User role', 400);
    }

    if (!ROLES.includes(role)) {
        throw new ResponseError('Invalid role', 400);
    }

    if (!(await userService.updateRole(Number(req.params.id), role))) {
        throw new ResponseError('Error updating user role', 400);
    }

    return res.sendStatus(200);
};

const ban = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const { motive } = req.body;

    if (!userId) {
        throw new ResponseError('Missing user Id!', 400);
    }

    if (!motive || motive === '') {
        throw new ResponseError('Missing Ban motive', 400);
    }

    await userService.updateStatus(userId, false);
    await userService.ban(userId, motive);

    return res.sendStatus(200);
};

const unban = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    if (!userId) {
        throw new ResponseError('Missing user Id!', 400);
    }

    await userService.updateStatus(userId, true);

    return res.sendStatus(200);
};

export const userController = {
    update,
    updatePassword,
    list,
    get,
    updateImage,
    updateRole,
    ban,
    unban,
};
