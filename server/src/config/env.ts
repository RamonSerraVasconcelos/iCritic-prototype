import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVER_PORT = (process.env.SERVER_PORT || 8080) as number;
const SERVER_URL = process.env.SERVER_URL
    ? process.env.SERVER_URL
    : `http://localhost:${SERVER_PORT}`;

const CLIENT_URL = process.env.CLIENT_URL
    ? process.env.CLIENT_URL
    : `http://localhost:3000`;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRE_TIME = '10m' || process.env.ACCESS_TOKEN_EXPIRE_TIME;
const REFRESH_TOKEN_EXPIRE_TIME = '1d' || process.env.REFRESH_TOKEN_EXPIRE_TIME;

const ALLOWED_ORIGINS = [SERVER_URL, CLIENT_URL];
const ONE_HOUR = 1 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const env = {
    NODE_ENV,
    SERVER_PORT,
    SERVER_URL,
    CLIENT_URL,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE_TIME,
    REFRESH_TOKEN_EXPIRE_TIME,
    ALLOWED_ORIGINS,
    ONE_HOUR,
    ONE_DAY,
};

export default env;
