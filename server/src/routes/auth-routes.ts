import { Router } from 'express';
import { validate } from '@src/middlewares/validate-middleware';
import { tryCatch } from '@src/utils/try-catch';
import { authSchema } from '@src/schemas/auth-schema';
import { authController } from '@src/controllers/auth-controller';

const routes = Router();

// Authentication
routes.post(
    '/register',
    validate(authSchema.register),
    tryCatch(authController.register),
);
routes.post(
    '/login',
    validate(authSchema.login),
    tryCatch(authController.login),
);
routes.get('/logout', tryCatch(authController.logout));
routes.get('/refresh', tryCatch(authController.refresh));

// Password reset
routes.post(
    '/forgot-password',
    validate(authSchema.forgotPassword),
    tryCatch(authController.forgotPassword),
);
routes.post(
    '/reset-password/:passwordResetHash/:email',
    validate(authSchema.resetPassword),
    tryCatch(authController.resetPassword),
);

export default routes;
