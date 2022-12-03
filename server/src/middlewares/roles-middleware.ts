import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '@src/ts/classes/response-error';
import { Role } from '@prisma/client';
import { tryCatch } from '@src/utils/try-catch';

export const roles = (...allowedRoles: Role[]) => {
    return tryCatch(async (req: Request, res: Response, next: NextFunction) => {
        const rolesArray = [...allowedRoles];

        const userRole = req.user.role;
        if (!userRole) throw new ResponseError('No role specified!', 401);

        const isAllowed = rolesArray.includes(userRole);
        if (!isAllowed) throw new ResponseError('Unauthorized!', 401);

        return next();
    });
};
