import supertest from 'supertest';
import generator from '@src/utils/random-generator';
import app from '@src/app';
import userService from '@src/services/user-service';
import movieService from '@src/services/movie-service';

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

    describe('edit director', () => {
        it('should edit the director and return 200 ok', async () => {
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

            const director = await movieService.createDirector(
                'Edit director test',
                1,
            );

            const newDirectorData = {
                name: 'Edit director test 2',
                countryId: 2,
            };

            await supertest(app)
                .patch(`/movies/directors/${director.id}`)
                .send(newDirectorData)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).toBe(director.id);
                    expect(res.body.name).toBe(newDirectorData.name);
                    expect(res.body.name).toBeDefined();
                });
        });
    });

    describe('get director', () => {
        it('should get the director and return 200 ok', async () => {
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

            const director = await movieService.createDirector(
                'Get director test',
                1,
            );

            await supertest(app)
                .get(`/movies/directors/${director.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.id).toBe(director.id);
                    expect(res.body.name).toBe(director.name);
                    expect(res.body.name).toBeDefined();
                });
        });
    });

    describe('list categories', () => {
        it('should get all ', async () => {
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

            const directors = [
                {
                    name: 'Testing listing',
                    countryId: 1,
                },
                {
                    name: 'Testing listing 2',
                    countryId: 2,
                },
            ];

            movieService.createDirector(
                directors[0].name,
                directors[0].countryId,
            );
            movieService.createDirector(
                directors[1].name,
                directors[1].countryId,
            );

            await supertest(app)
                .get('/movies/directors/list')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });
    });
});
