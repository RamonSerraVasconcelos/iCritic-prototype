import { Request, Response } from 'express';
import ResponseError from '@src/ts/classes/response-error';
import userService from '@src/services/user-service';

const register = async (req: Request, res: Response) => {
    const isDuplicated = await userService.findByEmail(req.body.email);

    if (isDuplicated) throw new ResponseError('This email is already registered!', 409);

    const user = await userService.create(req.body);

    if (!user) throw new ResponseError('Something went wrong.', 400);

    return res.status(201).json({
        user,
    });
};

const update = async (req: Request, res: Response) => {
    if (req.body.id !== req.user.id) {
        throw new ResponseError("You cannot edit another user's info", 403);
    }

    if (!userService.update(req.body)) {
        throw new ResponseError('Please review the user id and its fields', 400);
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

const get = async (req: Request, res: Response) => {
    const user = await userService.findById(req.body.id);

    if (!user) {
        throw new ResponseError('', 404);
    }

    return res.status(200).send({
        user,
    });
};

export default {
    register,
    update,
    list,
    get,
};
