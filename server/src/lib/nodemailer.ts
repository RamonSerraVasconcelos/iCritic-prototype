import { env } from '@src/config/env';
import { createTransport, TransportOptions } from 'nodemailer';

const transportOptions = {
    host: env.NODEMAILER_HOST,
    port: env.NODEMAILER_PORT,
    auth: {
        user: env.NODEMAILER_USER,
        pass: env.NODEMAILER_PASSWORD,
    },
} as TransportOptions;

const sendPasswordResetLink = async (
    email: string,
    passwordResetHash: string,
) => {
    const transport = createTransport(transportOptions);
    const link = `${env.SERVER_URL}/reset-password/${passwordResetHash}?email=${email}`;

    await transport.sendMail({
        from: `noreply@icritic.com`,
        to: email,
        subject: 'iCritic - Reset your password',
        html: `
            <p>If you didn't request a password reset, ignore this email.</p>
            <a href=${link} target="_blank">Click here</a> to reset your password!
        `,
    });
};

export const nodemailer = { sendPasswordResetLink };
