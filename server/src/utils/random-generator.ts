import crypto from 'crypto';
import { hash } from 'bcrypt';
import { prisma } from '@src/lib/prisma';

const generator = {
    getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    },
    getRandomString(): string {
        return crypto.randomBytes(10).toString('hex');
    },
    getRandomEmail(): string {
        return `${crypto.randomBytes(6).toString('hex')}@test.com`;
    },
    async getRandomUser() {
        const hashedPassword = await hash('12345678', 10);

        return {
            email: this.getRandomEmail(),
            name: this.getRandomString(),
            description: this.getRandomString(),
            countryId: this.getRandomInt(228),
            password: hashedPassword,
        };
    },
    async createRandomUser() {
        const newUser = await this.getRandomUser();

        const user = await prisma.user.create({
            data: {
                email: newUser.email,
                name: newUser.name,
                description: newUser.description,
                countryId: newUser.countryId,
                password: newUser.password,
            },
        });

        user.password = '12345678';

        return user;
    },
};

export default generator;
