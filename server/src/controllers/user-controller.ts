import { NextFunction, Request, Response } from 'express';
import ResponseError from '@src/ts/classes/response-error';
import userService from '@src/services/user-service';

const register = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.create(req.body);
    if (user) return res.status(201).json({ user });
    return next();
};

const update = async (req: Request, res: Response) => {
    if (!userService.update(req.body)) {
        throw new ResponseError('Something went wrong. Please review the user id and its fields', 400);
    }

    return res.status(200).send();
};

const list = async (req: Request, res: Response) => {
    const users = await userService.find();

    if (!users) {
        throw new ResponseError('', 204);
    }

    return res.status(200).send({
        users,
    });
};

const get = async (req: Request, res: Response) => {};

export default {
    register,
    update,
    list,
    get,
};
