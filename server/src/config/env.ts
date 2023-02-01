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

const HTTPS_SECURE = process.env.NODE_ENV === 'production';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRE_TIME = process.env.ACCESS_TOKEN_EXPIRE_TIME || '1m';
const REFRESH_TOKEN_EXPIRE_TIME = process.env.REFRESH_TOKEN_EXPIRE_TIME || '1d';

const NODEMAILER_HOST = process.env.NODEMAILER_HOST!;
const NODEMAILER_PORT = process.env.NODEMAILER_PORT!;
const NODEMAILER_USER = process.env.NODEMAILER_USER!;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD!;

const ALLOWED_ORIGINS = [SERVER_URL, CLIENT_URL];
const ONE_HOUR = 1 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

export const env = {
    NODE_ENV,
    SERVER_PORT,
    SERVER_URL,
    CLIENT_URL,
    HTTPS_SECURE,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE_TIME,
    REFRESH_TOKEN_EXPIRE_TIME,
    NODEMAILER_HOST,
    NODEMAILER_PORT,
    NODEMAILER_USER,
    NODEMAILER_PASSWORD,
    ALLOWED_ORIGINS,
    ONE_HOUR,
    ONE_DAY,
};
