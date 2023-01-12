import { exec } from 'child_process';
import supertest from 'supertest';
import { prisma } from '@src/lib/prisma';
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
            const data = {
                email: 'create@test.test',
                name: 'Test User',
                description: 'Testing user',
                countryId: 29,
                password: '12345678',
            };

            await supertest(app)
                .post(`/register`)
                .send(data)
                .expect(201)
                .then(async (res) => {
                    expect(res.body.user.id).toBeTruthy();
                    expect(res.body.user.name).toBeTruthy();
                    expect(res.body.user.email).toBeTruthy();
                    expect(res.body.user.description).toBeTruthy();
                });
        });
    });
});
