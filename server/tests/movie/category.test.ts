import supertest from 'supertest';
import generator from '@src/utils/random-generator';
import app from '@src/app';
import userService from '@src/services/user-service';
import movieService from '@src/services/movie-service';

describe('category', () => {
    describe('register category', () => {
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

            const category = {
                name: 'Test Category',
            };

            await supertest(app)
                .post('/movies/categories')
                .send(category)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
                .then((res) => {
                    expect(res.body.id).toBeDefined();
                    expect(res.body.name).toBeDefined();
                });
        });
    });

    describe('edit category', () => {
        it('should edit the category and return 200 ok', async () => {
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

            const category = await movieService.createCategory(
                'Edit category test',
            );

            const newCategoryData = {
                name: 'Editing category test',
            };

            await supertest(app)
                .patch(`/movies/categories/${category.id}`)
                .send(newCategoryData)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).toBe(category.id);
                    expect(res.body.name).toBe(newCategoryData.name);
                });
        });
    });

    describe('get category', () => {
        it('should get a category and return 200 ok', async () => {
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

            const category = await movieService.createCategory(
                'Get category test',
            );

            await supertest(app)
                .get(`/movies/categories/${category.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.id).toBe(category.id);
                    expect(res.body.name).toBe(category.name);
                });
        });
    });

    describe('list categories', () => {
        it('should return all categories and 200 ok', async () => {
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

            const categories = [
                {
                    name: 'Testing listing',
                },
                {
                    name: 'Testing listing 2',
                },
            ];

            movieService.createCategory(categories[0].name);
            movieService.createCategory(categories[1].name);

            await supertest(app)
                .get('/movies/categories/list')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then(async (res) => {
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });
    });
});
