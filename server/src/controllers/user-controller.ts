import { Request, Response } from 'express';
import ResponseError from '@src/ts/classes/response-error';
import userService from '@src/services/user-service';

const ROLES = ['USER', 'MODERATOR', 'ADMIN'];

const register = async (req: Request, res: Response) => {
    const isDuplicated = await userService.findByEmail(req.body.email);

    if (isDuplicated) throw new ResponseError('This email is already registered', 409);

    const user = await userService.create(req.body);

    if (!user) throw new ResponseError('User not found', 404);

    return res.status(201).json({
        user,
    });
};

const update = async (req: Request, res: Response) => {
    if (Number(req.params.id) !== req.user.id) {
        throw new ResponseError("You cannot edit another user's info", 403);
    }

    if (!userService.update(req.body)) {
        throw new ResponseError('Please review the user id and its fields', 400);
    }

    return res.status(200).send();
};

const updatePassword = async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;

    if (!password || password === '') throw new ResponseError('Missing password', 400);

    if (!confirmPassword || confirmPassword === '') throw new ResponseError('Missing password confirmation', 400);

    if (password !== confirmPassword) throw new ResponseError("Passwords don't match", 400);

    const user = await userService.findById(req.user.id);

    if (!user) throw new ResponseError('User not found', 404);

    const updatedPassword = await userService.updatePassword(req.user.id, password);

    if (!updatedPassword) throw new ResponseError('Error updating password', 400);

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
    const user = await userService.findById(req.body.id);

    if (!user) {
        throw new ResponseError('', 404);
    }

    return res.status(200).send({
        user,
    });
};

const updateImage = async (req: Request, res: Response) => {
    const documentFile = req.file;

    if (!documentFile) {
        throw new ResponseError('Error saving the file', 400);
    }

    if (!documentFile.filename || documentFile.filename === '') {
        throw new ResponseError('Error saving the file', 400);
    }

    if (!userService.updateImage(req.user.id, documentFile.filename)) {
        throw new ResponseError('Please review the user id and its fields', 400);
    }

    return res.status(200).send();
};

const updateRole = async (req: Request, res: Response) => {
    if (!req.params.id) {
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

    return res.status(200).send();
};

const ban = async (req: Request, res: Response) => {
    if (!req.params.id) {
        throw new ResponseError('Missing User Id', 400);
    }

    if (!req.body.motive || req.body.motive === '') {
        throw new ResponseError('Missing Ban motive', 400);
    }

    if (!(await userService.updateStatus(Number(req.params.id), false))) {
        throw new ResponseError('Error updating user status', 400);
    }

    if (!(await userService.ban(Number(req.params.id), req.body.motive))) {
        throw new ResponseError('Error updating user status', 400);
    }

    return res.status(200).send();
};

const unban = async (req: Request, res: Response) => {
    if (!req.params.id) {
        throw new ResponseError('Missing User Id', 400);
    }

    if (!(await userService.updateStatus(Number(req.params.id), true))) {
        throw new ResponseError('Error updating user status', 400);
    }

    return res.status(200).send();
};

export default {
    register,
    update,
    updatePassword,
    list,
    get,
    updateImage,
    updateRole,
    ban,
    unban,
};
