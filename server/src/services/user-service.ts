import { hash } from 'bcrypt';
import { UserProps } from '@src/ts/interfaces/user-props';
import { prisma, excludeFields, includeFields } from '@src/lib/prisma';
import { RefreshTokenProps } from '@src/ts/interfaces/refresh-token-props';
import { Role } from '@prisma/client';

const userService = {
    async list() {
        const users = await prisma.user.findMany({
            select: excludeFields('User', [
                'email',
                'password',
                'passwordResetHash',
                'passwordResetDate',
                'emailResetHash',
                'emailResetDate',
                'newEmailReset',
                'updatedAt',
            ]),
        });

        return users;
    },
    async findByIdWithAllFields(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        return user;
    },
    async findById(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: excludeFields('User', [
                'email',
                'password',
                'passwordResetHash',
                'passwordResetDate',
                'emailResetHash',
                'emailResetDate',
                'newEmailReset',
                'updatedAt',
            ]),
        });

        return user;
    },
    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        return user;
    },
    async findByRefreshToken(refreshToken: string) {
        const token = await prisma.refreshToken.findFirst({
            where: { token: refreshToken },
            include: {
                user: true,
            },
        });

        return token?.user;
    },
    async findByResetHashPassword(email: string) {
        const user = await prisma.user.findFirst({
            where: { email },
            select: includeFields('User', [
                'id',
                'password',
                'passwordResetHash',
                'passwordResetDate',
            ]),
        });

        return user;
    },
    async create(user: UserProps) {
        const hashedPassword = await hash(user.password, 10);

        const createdUser = await prisma.user.create({
            data: {
                ...user,
                email: user.email.toLowerCase(),
                password: hashedPassword,
                countryId: Number(user.countryId),
            },
            select: includeFields('User', [
                'id',
                'name',
                'email',
                'description',
            ]),
        });

        return createdUser;
    },
    async createRefreshToken(refreshToken: RefreshTokenProps) {
        const createdRefreshToken = await prisma.refreshToken.create({
            data: refreshToken,
        });

        return createdRefreshToken;
    },
    async update(userId: number, user: UserProps) {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: user.name || undefined,
                description: user.description || undefined,
                countryId: user.countryId || undefined,
            },
        });

        return updatedUser;
    },
    async updatePassword(userId: number, password: string) {
        const hashedPassword = await hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        return updatedUser;
    },
    async updateRole(userId: number, role: Role) {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role,
            },
        });

        return updatedUser;
    },
    async deleteRefreshToken(refreshToken: string) {
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    },
    async deleteAllRefreshTokens(userId: number) {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    },
    async updatePasswordResetHash(
        userId: number,
        passwordResetHash: string | null,
    ) {
        const nowPlusTenMinutes = new Date();
        nowPlusTenMinutes.setMinutes(nowPlusTenMinutes.getMinutes() + 10); // adding 10 minutes as expiring time

        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                passwordResetHash,
                passwordResetDate: nowPlusTenMinutes,
            },
        });

        return user;
    },
    async updateEmailResetHash(
        userId: number,
        newEmailReset: string | null,
        emailResetHash: string | null,
        emailResetDate: Date | null,
    ) {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                newEmailReset,
                emailResetHash,
                emailResetDate,
            },
        });

        return user;
    },
    async updateUserEmail(id: number, email: string) {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
                newEmailReset: null,
            },
        });

        return user;
    },
    async updateAvatar(userId: number, imagePath: string) {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                image: {
                    create: {
                        path: imagePath,
                    },
                },
            },
        });

        return user;
    },
    async ban(userId: number, motive: string) {
        const bannedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                active: false,
            },
        });

        await prisma.banList.create({
            data: {
                userId,
                motive,
            },
        });

        return bannedUser;
    },
    async unban(userId: number) {
        const unbannedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                active: true,
            },
        });

        return unbannedUser;
    },
};

export default userService;
