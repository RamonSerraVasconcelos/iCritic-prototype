import { ResponseError } from '@src/ts/classes/response-error';
import { tryCatch } from '@src/utils/try-catch';
import { Request, Response, NextFunction } from 'express';
import { OptionalObjectSchema } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';

export const validate = (schema: OptionalObjectSchema<AnyObject>) =>
    tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { body } = req;

        await schema.validate(body).catch((error) => {
            throw new ResponseError(error.message, 400);
        });

        return next();
    });
