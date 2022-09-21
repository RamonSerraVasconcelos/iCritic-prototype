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

const updateProfilePic = async (req: Request, res: Response) => {
    if (!req.body.id || req.body.id === '') {
        throw new ResponseError('Missing User Id', 400);
    }

    if (Object.keys(req.body).length > 1) {
        throw new ResponseError('You can only pass the User Id as argument', 400);
    }

    if (req.body.id !== req.user.id) {
        throw new ResponseError("You cannot edit another user's info", 403);
    }

    const documentFile = (req as any).file;
    if (!documentFile) {
        throw new ResponseError('Error saving the file', 400);
    }

    if (!documentFile.filename || documentFile.filename === '') {
        throw new ResponseError('Error saving the file', 400);
    }

    if (!userService.updateProfilePic(req.body.id, documentFile.filename)) {
        throw new ResponseError('Please review the user id and its fields', 400);
    }

    return res.status(200).send();
};

export default {
    register,
    update,
    list,
    get,
    updateProfilePic,
};
