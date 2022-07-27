import {CorsOptions} from 'cors';
import env from './env';

const corsOptions: CorsOptions = {
    origin: (origin, cb) => {
        if (env.ALLOWED_ORIGINS.indexOf(origin as string) !== -1 || !origin) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS!'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;
