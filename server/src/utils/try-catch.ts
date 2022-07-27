import {Request, Response, NextFunction} from 'express';

const tryCatch =
    (anyFunction: Function) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(anyFunction(req, res, next)).catch(next);

export default tryCatch;
