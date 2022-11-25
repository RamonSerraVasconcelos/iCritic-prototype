import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer';
import env from '@src/config/env';

export default nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE,
    requireTLS: env.EMAIL_REQUIRE_TLS,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
    },
} as SMTPTransport.SendMailOptions);
