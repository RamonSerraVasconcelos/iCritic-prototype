import { hash } from 'bcrypt';
import { UserProps } from '@src/ts/interfaces/user-props';
import { prisma, excludeFields, includeFields } from '@src/lib/prisma';
import { RefreshTokenProps } from '@src/ts/interfaces/refresh-token-props';

const list = async () => {
    const users = await prisma.user.findMany({
        select: excludeFields('User', [
            'password',
            'passwordResetHash',
            'passwordResetDate',
            'updatedAt',
        ]),
    });

    return users;
};

const findById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: excludeFields('User', [
            'password',
            'passwordResetHash',
            'passwordResetDate',
            'updatedAt',
        ]),
    });

    return user;
};

const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });

    return user;
};

const findByRefreshToken = async (refreshToken: string) => {
    const token = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
        include: {
            user: true,
        },
    });

    return token?.user;
};

const findByResetHashPassword = async (email: string) => {
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
};

const create = async (user: UserProps) => {
    const hashedPassword = await hash(user.password, 10);

    const createdUser = await prisma.user.create({
        data: {
            ...user,
            email: user.email.toLowerCase(),
            password: hashedPassword,
            countryId: Number(user.countryId),
        },
        select: includeFields('User', ['id', 'name', 'email', 'description']),
    });

    return createdUser;
};

const createRefreshToken = async (refreshToken: RefreshTokenProps) => {
    const createdRefreshToken = await prisma.refreshToken.create({
        data: refreshToken,
    });

    return createdRefreshToken;
};

const update = async (userId: number, user: UserProps) => {
    const password = user.password ? await hash(user.password, 10) : undefined;

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: user.name || undefined,
            email: user.email || undefined,
            password,
            description: user.description || undefined,
            role: user.role || undefined,
            countryId: user.countryId || undefined,
            active: user.active,
            passwordResetHash: user.passwordResetHash || undefined,
            passwordResetDate: user.passwordResetDate || undefined,
            emailResetHash: user.emailResetHash || undefined,
            emailResetDate: user.emailResetDate || undefined,
        },
    });

    return updatedUser;
};

const deleteRefreshToken = async (refreshToken: string) => {
    await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
    });
};

const deleteAllRefreshTokens = async (userId: number) => {
    await prisma.refreshToken.deleteMany({
        where: { userId },
    });
};

const updatePasswordResetHash = async (
    userId: number,
    passwordResetHash: string | null,
) => {
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
};

const updateEmailResetHash = async (
    userId: number,
    newEmailReset: string,
    emailResetHash: string | null,
    emailResetDate: Date | null,
) => {
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
};

const updateAvatar = async (userId: number, imagePath: string) => {
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
};

const ban = async (userId: number, motive: string) => {
    const insertedBan = await prisma.banList.create({
        data: {
            userId,
            motive,
        },
    });

    return insertedBan;
};

export const userService = {
    list,
    findById,
    findByEmail,
    findByRefreshToken,
    findByResetHashPassword,
    create,
    createRefreshToken,
    update,
    updatePasswordResetHash,
    updateEmailResetHash,
    updateAvatar,
    deleteRefreshToken,
    deleteAllRefreshTokens,
    ban,
};
