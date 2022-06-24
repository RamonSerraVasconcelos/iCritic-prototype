import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import ResponseError from '@src/ts/classes/ResponseError';
import cors from 'cors';
import path from 'path';
import routes from './routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const server = express();
server.use(express.json());
server.use(cors());
server.use('/api', routes);

// Error handling
server.use((req: Request, res: Response, next: NextFunction) => {
    const error = new ResponseError(['Not found!'], 404);
    next(error);
});

server.use(
    (error: ResponseError, req: Request, res: Response, next: NextFunction) => {
        res.status(error.status || 500);
        res.send({
            error: {
                status: error.status || 500,
                message: error.message
            }
        });
        next();
    }
);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port: http://localhost:${process.env.PORT || 3000}`)
});