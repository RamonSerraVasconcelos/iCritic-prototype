import supertest from 'supertest';
import generator from '@src/utils/random-generator';
import userService from '@src/services/user-service';
import { UserProps } from '@src/ts/interfaces/user-props';
import app from '@src/app';
import crypto from 'crypto';
import { hash } from 'bcrypt';
import { Request, Response } from 'express';
import userController from '@src/controllers/user-controller';
import { requestMock, responseMock } from '../mock/expressRequestMock';

describe('user', () => {
    describe('password must be at least 8 characters long', () => {
        it('should return 400 bad request', async () => {
            const userData = await generator.getRandomUser();
            userData.password = '1234567';
            await supertest(app).post(`/register`).send(userData).expect(400);
        });
    });

    describe('password must be at least 8 characters long', () => {
        it('should return 400 bad request', async () => {
            const userData = await generator.getRandomUser();
            userData.name = 'a';
            userData.password = '12345678';
            await supertest(app).post(`/register`).send(userData).expect(400);
        });
    });

    describe('2 users cannot have the same email', () => {
        it('should return conflict 409', async () => {
            const user1 = await generator.createRandomUser();

            const userData = await generator.getRandomUser();
            userData.email = user1.email;
            userData.password = '12345678';
            await supertest(app).post(`/register`).send(userData).expect(409);
        });
    });

    describe('register user', () => {
        it('should create user and return his data', async () => {
            const userData = await generator.getRandomUser();
            userData.password = '12345678';
            await supertest(app)
                .post(`/register`)
                .send(userData)
                .expect(201)
                .then(async (res) => {
                    expect(res.body.user.id).toBeTruthy();
                    expect(res.body.user.name).toBeTruthy();
                    expect(res.body.user.email).toBeTruthy();
                    expect(res.body.user.description).toBeTruthy();
                });
        });
    });

    describe('get user', () => {
        it('should return user info', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            await supertest(app)
                .get(`/users/${userData.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.user.id).toBeTruthy();
                    expect(res.body.user.name).toBeTruthy();
                    expect(res.body.user.email).toBeTruthy();
                    expect(res.body.user.description).toBeTruthy();
                    expect(res.body.user.role).toBeTruthy();
                    expect(res.body.user.active).toBeTruthy();
                    expect(res.body.user.countryId).toBeTruthy();
                    expect(res.body.user.createdAt).toBeTruthy();
                });
        });
    });

    describe('edit user', () => {
        it('should update username and description', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            const body = {
                name: 'new name',
                description: 'new description',
            };

            await supertest(app)
                .put(`/users/edit`)
                .send(body)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            await supertest(app)
                .get(`/users/${userData.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.user.name).toBe('new name');
                    expect(res.body.user.description).toBe('new description');
                });
        });
    });

    describe('only admins can change other users roles', () => {
        it('should return forbidden 403', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            const user2 = await generator.createRandomUser();
            const newRole = 'MODERATOR';

            await supertest(app)
                .patch(`/users/${user2.id}/role`)
                .send({ role: newRole })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(403);
        });
    });

    describe('change user role', () => {
        it('should change user role and return ok', async () => {
            const userData = await generator.createRandomUser();
            const role = 'ADMIN';

            userService.updateRole(userData.id, role);

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            const newUser = await generator.createRandomUser();
            const newRole = 'MODERATOR';

            await supertest(app)
                .patch(`/users/${newUser.id}/role`)
                .send({ role: newRole })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            const newUserRole = await userService.findById(newUser.id);
            expect(newUserRole!.role).toBe(newRole);
        });
    });

    describe('only moderator and admins can ban other users', () => {
        it('should return 403 forbidden', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            const user2 = await generator.createRandomUser();
            const body = { motive: 'ban user test' };

            await supertest(app)
                .patch(`/users/${user2.id}/ban`)
                .send(body)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(403);
        });
    });

    describe('ban user', () => {
        it('should ban user and return ok', async () => {
            const userData = await generator.createRandomUser();
            const role = 'ADMIN';

            userService.updateRole(userData.id, role);

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            const newUser = await generator.createRandomUser();
            const body = { motive: 'ban user test' };

            await supertest(app)
                .patch(`/users/${newUser.id}/ban`)
                .send(body)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            const user = await userService.findById(newUser.id);
            if (user) expect(user.active).toBe(false);
        });
    });

    describe('unban user', () => {
        it('should unban user and return ok', async () => {
            const userData = await generator.createRandomUser();
            const role = 'ADMIN';

            userService.updateRole(userData.id, role);

            const data = {
                email: userData.email,
                password: userData.password,
            };

            const newUser = await generator.createRandomUser();
            userService.ban(newUser.id, 'ban user test');

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            await supertest(app)
                .patch(`/users/${newUser.id}/unban`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            const user = await userService.findById(newUser.id);
            if (user) expect(user.active).toBe(true);
        });
    });

    describe('request email change', () => {
        it('should return ok 200', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            const newEmail = {
                email: 'newemail@test.test',
            };

            await supertest(app)
                .post(`/users/request-email-change`)
                .send(newEmail)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });
    });

    describe('try to use an invalid email', () => {
        it('should return bad request 400', async () => {
            const userData = await generator.createRandomUser();

            const data = {
                email: userData.email,
                password: userData.password,
            };

            let accessToken = '';

            await supertest(app)
                .post(`/login`)
                .send(data)
                .expect(200)
                .then(async (res) => {
                    accessToken = res.body.accessToken;
                });

            const newEmail = {
                email: 'invalidemail',
            };

            await supertest(app)
                .post(`/users/request-email-change`)
                .send(newEmail)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400);
        });
    });

    describe('confirm email change', () => {
        it('should return ok 200', async () => {
            const userData = await generator.createRandomUser();

            const emailResetHash = crypto.randomUUID();
            const encryptedHash = await hash(emailResetHash, 10);

            const nowPlusTenMinutes = new Date();
            nowPlusTenMinutes.setMinutes(nowPlusTenMinutes.getMinutes() + 1);

            await userService.updateEmailResetHash(
                userData.id,
                'confirmemailchange@test.test',
                encryptedHash,
                nowPlusTenMinutes,
            );

            const data = {
                id: userData.id,
                emailResetHash,
            };

            await supertest(app).post(`/email-reset`).send(data).expect(200);
        });
    });

    describe('a user cannot change another user email even with a valid hash', () => {
        it('should return forbidden 403', async () => {
            const userData = await generator.createRandomUser();

            const emailResetHash = crypto.randomUUID();
            const encryptedHash = await hash(emailResetHash, 10);

            const nowPlusTenMinutes = new Date();
            nowPlusTenMinutes.setMinutes(nowPlusTenMinutes.getMinutes() + 1);

            await userService.updateEmailResetHash(
                userData.id,
                'validateuseremailchange@test.test',
                encryptedHash,
                nowPlusTenMinutes,
            );

            // generate another user and try to change his email with a valid hash
            const userToBeModified = await generator.createRandomUser();

            const data = {
                id: userToBeModified.id,
                emailResetHash,
            };

            await supertest(app).post(`/email-reset`).send(data).expect(400);
        });
    });

    describe('try to change the email using an invalid token', () => {
        it('should return forbidden 403', async () => {
            const userData = await generator.createRandomUser();

            const request = requestMock;
            const response = responseMock;

            request.body = {
                email: 'validateemailchangewithinvalidtoken@test.test',
            };

            request.user = {
                id: userData.id,
                name: 'validateemailchangewithinvalidtoken',
                role: 'DEFAULT',
            };

            await userController.requestEmailChange(
                request,
                response as Response,
            );

            const data = {
                id: userData.id,
                emailResetHash: 'randomresethash',
            };

            await supertest(app).post(`/email-reset`).send(data).expect(403);
        });
    });

    describe('try to change the email using an expired token', () => {
        it('should return forbidden 403', async () => {
            const userData = await generator.createRandomUser();

            const emailResetHash = crypto.randomUUID();
            const encryptedHash = await hash(emailResetHash, 10);

            const now = new Date();

            await userService.updateEmailResetHash(
                userData.id,
                'validatetokenexpiretime@test.test',
                encryptedHash,
                now,
            );

            const data = {
                id: userData.id,
                emailResetHash,
            };

            await supertest(app).post(`/email-reset`).send(data).expect(403);
        });
    });
});
