import supertest from 'supertest';
import generator from '@src/utils/random-generator';
import app from '@src/app';
import userService from '@src/services/user-service';
import movieService from '@src/services/movie-service';

describe('movie', () => {
    let accessToken = '';

    beforeAll(async () => {
        const userData = await generator.createRandomUser();

        const role = 'ADMIN';
        userService.updateRole(userData.id, role);

        const data = {
            email: userData.email,
            password: userData.password,
        };

        await supertest(app)
            .post(`/login`)
            .send(data)
            .expect(200)
            .then(async (res) => {
                accessToken = res.body.accessToken;
            });

        await movieService.createCategory('Test movie category 1');
        await movieService.createCategory('Test movie category 2');

        await movieService.createDirector('Test movie director 1', 218);
        await movieService.createDirector('Test movie director 2', 218);

        await movieService.createActor('Test movie actor 1', 218);
        await movieService.createActor('Test movie actor 2', 218);
    });

    describe('register movie', () => {
        it('should register the movie and return 201 created', async () => {
            const movie = {
                name: 'Test movie',
                synopsis: 'Good movie',
                releaseDate: '2018-03-10',
                categories: [1, 2],
                directors: [1, 2],
                actors: [1, 2],
                countryId: 218,
                languageId: 27,
            };

            await supertest(app)
                .post('/movies')
                .send(movie)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);
        });
    });

    describe('edit movie', () => {
        it('should edit the movie and return 200', async () => {
            const movie = {
                id: 0,
                rating: 0,
                name: 'Test edit movie',
                synopsis: 'Good movie',
                releaseDate: '2018-03-10',
                categories: [{ categoryId: 1 }, { categoryId: 2 }],
                directors: [{ directorId: 1 }, { directorId: 2 }],
                actors: [{ actorId: 1 }, { actorId: 2 }],
                countryId: 218,
                languageId: 27,
            };

            const { id } = await movieService.create(movie);

            const editedMovie = {
                name: 'Test edited movie',
                synopsis: 'Good edited movie',
            };

            await supertest(app)
                .patch(`/movies/${id}`)
                .send(editedMovie)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body.name).toBe(editedMovie.name);
                    expect(res.body.synopsis).toBe(editedMovie.synopsis);
                });
        });
    });

    describe('list movies', () => {
        it('should retrieve all movies and return 200', async () => {
            const movie1 = {
                id: 0,
                rating: 0,
                name: 'Test list movie',
                synopsis: 'Good movie',
                releaseDate: '2018-03-10',
                categories: [{ categoryId: 1 }, { categoryId: 2 }],
                directors: [{ directorId: 1 }, { directorId: 2 }],
                actors: [{ actorId: 1 }, { actorId: 2 }],
                countryId: 218,
                languageId: 27,
            };

            const movie2 = {
                id: 0,
                rating: 0,
                name: 'Test list movie 2',
                synopsis: 'Good movie',
                releaseDate: '2018-03-10',
                categories: [{ categoryId: 1 }, { categoryId: 2 }],
                directors: [{ directorId: 1 }, { directorId: 2 }],
                actors: [{ actorId: 1 }, { actorId: 2 }],
                countryId: 218,
                languageId: 27,
            };

            await movieService.create(movie1);
            await movieService.create(movie2);

            await supertest(app)
                .get('/movies')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.movies.length).toBeGreaterThan(0);
                });
        });
    });

    describe('get movie', () => {
        it('should retrieve the movie and return 200 ok', async () => {
            const movie = {
                id: 0,
                rating: 0,
                name: 'Test get movie',
                synopsis: 'Good movie',
                releaseDate: '2018-03-10',
                categories: [{ categoryId: 1 }, { categoryId: 2 }],
                directors: [{ directorId: 1 }, { directorId: 2 }],
                actors: [{ actorId: 1 }, { actorId: 2 }],
                countryId: 218,
                languageId: 27,
            };

            const { id } = await movieService.create(movie);

            await supertest(app)
                .get(`/movies/${id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.movie).toBeTruthy();
                });
        });
    });
});
