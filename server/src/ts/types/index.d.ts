import { DecodedProps } from '@src/ts/interfaces/decoded-props';

export {};

declare global {
    namespace Express {
        interface Request {
            user: DecodedProps['user'];
        }
    }
}
