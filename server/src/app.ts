import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsOptions } from '@src/config/cors-options';
import cookieParser from 'cookie-parser';
import routes from '@src/routes';
import { ResponseError } from '@src/ts/classes/response-error';

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/', routes);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new ResponseError('', 404);
    next(error);
});

app.use(
    (error: ResponseError, req: Request, res: Response, next: NextFunction) => {
        const { status, message } = error;

        res.status(status || 500).json({
            error: {
                message: status ? message : '',
            },
        });

        if (!status) console.error(message);

        next();
    },
);

export default app;
