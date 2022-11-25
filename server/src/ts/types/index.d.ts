import { UserProps } from '@src/ts/interfaces/user-props';

export {};

declare global {
    namespace Express {
        interface Request {
            user: UserProps;
        }
    }
}
