import supertest from 'supertest';
import generator from '@src/utils/random-generator';
import app from '@src/app';
import userService from '@src/services/user-service';
import movieService from '@src/services/movie-service';

describe('actors', () => {
    describe('register actor', () => {
        it('shoudn return 201 created', async () => {
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

            const actor = {
                name: 'create actor test',
                countryId: 219,
            };

            await supertest(app)
                .post('/movies/actors')
                .send(actor)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
                .then((res) => {
                    expect(res.body.id).toBeDefined();
                    expect(res.body.name).toBeDefined();
                    expect(res.body.country).toBeDefined();
                });
        });
    });

    describe('edit actor', () => {
        it('should edit actor and return 200 ok', async () => {
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

            const actor = await movieService.createActor('edit actor test', 219);

            const newActorData = {
                name: 'edited actor',
                countryId: 220,
            };

            await supertest(app)
                .patch(`/movies/actors/${actor.id}`)
                .send(newActorData)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).toBe(actor.id);
                    expect(res.body.name).toBe(newActorData.name);
                    expect(res.body.country.id).toBe(newActorData.countryId);
                });
        });
    });

    describe('list actors', () => {
        it('shound load all actors and bring 200 ok', async () => {
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

            const actors = [
                {
                    name: 'Testing listing',
                    countryId: 218,
                },
                {
                    name: 'Testing listing 2',
                    countryId: 219,
                },
            ];

            movieService.createActor(actors[0].name, actors[0].countryId);
            movieService.createActor(actors[1].name, actors[1].countryId);

            await supertest(app)
                .get('/movies/actors/list')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });
    });

    describe('get actor', () => {
        it('should recover actor and return 200 ok', async () => {
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

            const actor = await movieService.createActor('get actor test', 218);

            await supertest(app)
                .get(`/movies/actors/${actor.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.id).toBe(actor.id);
                    expect(res.body.name).toBe(actor.name);
                    expect(res.body.country.id).toBe(actor.country.id);
                });
        });
    });
});
