import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import corsOptions from '@src/config/cors-options';
import cookieParser from 'cookie-parser';
import routes from '@src/routes';
import ResponseError from '@src/ts/classes/response-error';

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/', routes);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new ResponseError('Something went wrong!', 404);
    next(error);
});

app.use((error: ResponseError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({
        error: {
            status: error.status || 500,
            message: error.message,
        },
    });

    next();
});

export default app;
