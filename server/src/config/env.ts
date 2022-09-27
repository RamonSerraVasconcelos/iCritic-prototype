import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVER_PORT = (process.env.SERVER_PORT || 8080) as number;
const SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : `http://localhost:${SERVER_PORT}`;

const CLIENT_URL = process.env.CLIENT_URL ? process.env.CLIENT_URL : `http://localhost:3000`;

const HTTP_SECURE = process.env.ENVIRONMENT === 'prod';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRE_TIME = '10m' || process.env.ACCESS_TOKEN_EXPIRE_TIME;
const REFRESH_TOKEN_EXPIRE_TIME = '7d' || process.env.REFRESH_TOKEN_EXPIRE_TIME;

const EMAIL_HOST = process.env.EMAIL_HOST!;
const EMAIL_PORT = process.env.EMAIL_PORT!;
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';
const EMAIL_REQUIRE_TLS = process.env.EMAIL_REQUIRE_TLS === 'true';
const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD!;

const ALLOWED_ORIGINS = [SERVER_URL, CLIENT_URL];
const ONE_HOUR = 1 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const env = {
    NODE_ENV,
    SERVER_PORT,
    SERVER_URL,
    CLIENT_URL,
    HTTP_SECURE,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE_TIME,
    REFRESH_TOKEN_EXPIRE_TIME,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_REQUIRE_TLS,
    EMAIL_USER,
    EMAIL_PASSWORD,
    ALLOWED_ORIGINS,
    ONE_HOUR,
    ONE_DAY,
};

export default env;
