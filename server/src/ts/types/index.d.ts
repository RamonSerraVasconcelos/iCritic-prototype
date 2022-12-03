import { TokenProps } from '@src/ts/interfaces/token-props';

export {};

declare global {
    namespace Express {
        interface Request {
            user: TokenProps['user'];
        }
    }
}
