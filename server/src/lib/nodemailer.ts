import { env } from '@src/config/env';
import { createTransport, getTestMessageUrl, createTestAccount } from 'nodemailer';

const isProduction = env.NODE_ENV === 'production';

let transportOptions = {};

if (isProduction) {
    transportOptions = {
        host: env.NODEMAILER_HOST,
        port: env.NODEMAILER_PORT,
        auth: {
            user: env.NODEMAILER_USER,
            pass: env.NODEMAILER_PASSWORD,
        },
    };
} else {
    createTestAccount().then((account) => {
        transportOptions = {
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        };
    });
}

const sendPasswordResetLink = async (email: string, passwordResetHash: string) => {
    const transport = createTransport(transportOptions);
    const link = `${env.SERVER_URL}/reset-password/${passwordResetHash}`;

    const transporter = await transport.sendMail({
        from: `noreply@icritic.com`,
        to: email,
        subject: 'iCritic - Reset your password',
        html: `
            <p>If you didn't request a password reset, ignore this email.</p>
            <a href=${link} target="_blank">Click here</a> to reset your password!
        `,
    });

    if (!isProduction) console.log(`Preview URL: ${getTestMessageUrl(transporter)}`);
};

export const nodemailer = { sendPasswordResetLink };
