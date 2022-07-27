import { NextFunction, Request, Response } from 'express';
import userService from '@src/services/user-service';

const register = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.create(req.body);
    if (user) return res.status(201).json({ user });
    return next();
};

export default {
    register,
};
