import supertest from 'supertest';
import generator from '@src/utils/random-generator';
import app from '@src/app';
import userService from '@src/services/user-service';

describe('director', () => {
    describe('register director', () => {
        it('should return 201 created', async () => {
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

            const director = {
                name: 'Test Director',
                countryId: 1,
            };

            await supertest(app)
                .post('/movies/directors')
                .send(director)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
                .then((res) => {
                    expect(res.body.id).toBeDefined();
                    expect(res.body.name).toBeDefined();
                    expect(res.body.country).toBeDefined();
                });
        });
    });
});
