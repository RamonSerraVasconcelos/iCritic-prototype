import { exec } from 'child_process';
import supertest from 'supertest';
import { prisma } from '@src/lib/prisma';
import generator from '@src/utils/random-generator';
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
                .get(`/users/1`)
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
});
