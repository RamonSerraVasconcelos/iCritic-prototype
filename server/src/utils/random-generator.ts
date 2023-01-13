import crypto from 'crypto';
import { hash } from 'bcrypt';

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
};

export default generator;
