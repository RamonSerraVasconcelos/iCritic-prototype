import { exec } from 'child_process';
import supertest from 'supertest';
import { prisma } from '@src/lib/prisma';
import generator from '@src/utils/random-generator';
import { userService } from '@src/services/user-service';
import { UserProps } from '@src/ts/interfaces/user-props';
import app from '../../app';

describe('user', () => {
    beforeAll((done) => {
        exec('yarn migrate:test', (err): void => {
            if (err) throw new Error(err.message);
            done();
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
                .put(`/users/${userData.id}/edit`)
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

    describe('change user role', () => {
        it('should change user role and return ok', async () => {
            const userData = await generator.createRandomUser();
            const userRole = {
                role: 'ADMIN',
            } as UserProps;

            userService.update(userData.id, userRole);

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
                .patch(`users/${newUser.id}/role`)
                .send({ role: newRole })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            const newUserRole = await userService.findById(newUser.id);
            expect(newUserRole!.role).toBe(newRole);
        });
    });
});
