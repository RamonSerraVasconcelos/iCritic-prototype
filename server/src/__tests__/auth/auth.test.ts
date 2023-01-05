import supertest from 'supertest';
import { prisma } from '@src/lib/prisma';
import { hash } from 'bcrypt';
import { exec } from 'child_process';
import crypto from 'crypto';
import app from '../../app';

let refreshCookie: string;

describe('auth', () => {
    beforeAll((done) => {
        exec('yarn migrate:test', (err): void => {
            if (err) throw new Error(err.message);
            done();
        });
    });

    describe('login', () => {
        it('should return a 200 with user info', async () => {
            const hashedPassword = await hash('12345678', 10);

            await prisma.user.create({
                data: {
                    email: 'test@test.test',
                    name: 'Test User',
                    description: 'Testing user',
                    countryId: 29,
                    password: hashedPassword,
                },
            });

            const data = {
                email: 'test@test.test',
                password: '12345678',
            };

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    refreshCookie = res.headers['set-cookie'][0]
                        .split(',')
                        .map((item: string) => item.split(';')[0]);
                    expect(res.body.accessToken).toBeTruthy();
                });
        });
    });

    describe('refresh token', () => {
        it('should return a new access token', async () => {
            await supertest(app)
                .get(`/refresh`)
                .set('Cookie', refreshCookie)
                .expect(200)
                .then(async (res) => {
                    expect(res.headers['set-cookie']).toBeTruthy();
                    expect(res.body.accessToken).toBeTruthy();
                });
        });
    });

    describe('forgot password', () => {
        it('should return OK status code ', async () => {
            await supertest(app)
                .post(`/forgot-password`)
                .send({ email: 'test@test.test' })
                .expect(200);
        });
    });

    describe('reset password', () => {
        it('should reset the user password', async () => {
            const passwordResetToken = crypto.randomBytes(20).toString('hex');
            const hashedToken = await hash(passwordResetToken, 10);

            await prisma.user.update({
                where: {
                    email: 'test@test.test',
                },
                data: {
                    passwordResetHash: hashedToken,
                },
            });

            const data = {
                password: '123456789',
            };

            await supertest(app)
                .post(
                    `/reset-password/${passwordResetToken}?email=test@test.test`,
                )
                .send(data)
                .expect(200);

            await supertest(app)
                .post(`/login`)
                .send({
                    email: 'test@test.test',
                    password: '123456789',
                })
                .expect(200);
        });
    });
});
