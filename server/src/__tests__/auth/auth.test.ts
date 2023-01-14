import supertest from 'supertest';
import { prisma } from '@src/lib/prisma';
import { env } from '@src/config/env';
import { hash } from 'bcrypt';
import { exec } from 'child_process';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import generator from '@src/utils/random-generator';
import { userService } from '@src/services/user-service';
import app from '../../app';

describe('auth', () => {
    beforeAll((done) => {
        exec('yarn migrate:test', (err): void => {
            if (err) throw new Error(err.message);
            done();
        });
    });

    describe('login', () => {
        it('should return a 200 with user info', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    expect(
                        res.headers['set-cookie'][0]
                            .split(',')
                            .map((item: string) => item.split(';')[0]),
                    ).toBeTruthy();
                    expect(res.body.accessToken).toBeTruthy();
                });
        });
    });

    describe('refresh token', () => {
        it('should return a new access token', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let refreshToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    refreshToken = res.headers['set-cookie'][0]
                        .split(',')
                        .map((item: string) => item.split(';')[0]);
                });

            await supertest(app)
                .get(`/refresh`)
                .set('Cookie', refreshToken)
                .expect(200)
                .then(async (res) => {
                    expect(res.headers['set-cookie']).toBeTruthy();
                    expect(res.body.accessToken).toBeTruthy();
                });
        });
    });

    describe('try to use an invalid refresh token', () => {
        it('should return unauthorized', async () => {
            const refreshToken = crypto.randomBytes(20).toString('hex');

            await supertest(app)
                .get(`/refresh`)
                .set('Cookie', refreshToken)
                .expect(401);
        });
    });

    describe('try to use an expired refresh token', () => {
        it('should return unauthorized', async () => {
            const userData = await generator.createRandomUser();

            const user = {
                email: userData.email,
                password: userData.password,
            };

            const newRefreshToken = jwt.sign(
                {
                    user,
                },
                env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1s' },
            );

            const refreshToken = newRefreshToken;

            await supertest(app)
                .get(`/refresh`)
                .set('Cookie', refreshToken)
                .expect(401);
        });
    });

    describe('try to use the already used refresh token', () => {
        it('should return unauthorized', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let refreshToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    refreshToken = res.headers['set-cookie'][0]
                        .split(',')
                        .map((item: string) => item.split(';')[0]);
                });

            // remove refresh token from database
            const refreshTokenString = refreshToken[0].substring(
                refreshToken[0].indexOf('=') + 1,
            );
            await userService.deleteRefreshToken(refreshTokenString);

            // try to use it
            await supertest(app)
                .get(`/refresh`)
                .set('Cookie', refreshToken)
                .expect(401);
        });
    });

    describe('forgot password', () => {
        it('should return OK status code ', async () => {
            const hashedPassword = await hash('12345678', 10);

            await prisma.user.create({
                data: {
                    email: 'forgotpassword@test.test',
                    name: 'Forgot password test',
                    description: 'Testing user',
                    countryId: 29,
                    password: hashedPassword,
                },
            });

            await supertest(app)
                .post(`/forgot-password`)
                .send({ email: 'forgotpassword@test.test' })
                .expect(200);
        });
    });

    describe('reset password', () => {
        it('should reset the user password', async () => {
            const passwordResetToken = crypto.randomBytes(20).toString('hex');
            const hashedToken = await hash(passwordResetToken, 10);

            await prisma.user.update({
                where: {
                    email: 'forgotpassword@test.test',
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
                    `/reset-password/${passwordResetToken}?email=forgotpassword@test.test`,
                )
                .send(data)
                .expect(200);

            await supertest(app)
                .post(`/login`)
                .send({
                    email: 'forgotpassword@test.test',
                    password: '123456789',
                })
                .expect(200);
        });
    });

    describe('logout', () => {
        it('should destroy the refresh token and return ok', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let refreshToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    refreshToken = res.headers['set-cookie'][0]
                        .split(',')
                        .map((item: string) => item.split(';')[0]);
                });

            await supertest(app)
                .get(`/logout`)
                .set('Cookie', refreshToken)
                .expect(204);

            await supertest(app)
                .get(`/refresh`)
                .set('Cookie', refreshToken)
                .expect(401);
        });
    });
});
