import supertest from 'supertest';
import { prisma } from '@src/lib/prisma';
import { hash } from 'bcrypt';
import { exec } from 'child_process';
import crypto from 'crypto';
import app from '../../app';

let accessCookie: string;
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
                    accessCookie = res.headers['set-cookie'][1]
                        .split(',')
                        .map((item: string) => item.split(';')[0]);
                    refreshCookie = res.headers['set-cookie'][1]
                        .split(',')
                        .map((item: string) => item.split(';')[0]);
                    expect(res.body.id).toBeTruthy();
                    expect(res.body.name).toBeTruthy();
                });
        });
    });
});
