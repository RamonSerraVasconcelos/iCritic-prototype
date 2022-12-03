import { hash } from 'bcrypt';
import { UserProps } from '@src/ts/interfaces/user-props';
import { prisma, excludeFields } from '@src/config/prisma-client';

const list = async () => {
    const users = await prisma.user.findMany({
        select: excludeFields('User', [
            'password',
            'passwordResetHash',
            'passwordResetDate',
            'refreshToken',
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
            'refreshToken',
            'updatedAt',
        ]),
    });

    return user;
};

const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user;
};

const findByRefreshToken = async (refreshToken: string) => {
    const user = await prisma.user.findFirst({
        where: { refreshToken },
    });

    return user;
};

const findByPasswordResetHash = async (passwordResetHash: string) => {
    const user = await prisma.user.findFirst({
        where: { passwordResetHash },
        select: excludeFields('User', ['refreshToken', 'updatedAt']),
    });

    return user;
};

const create = async (user: UserProps) => {
    const hashedPassword = await hash(user.password, 10);

    const createdUser = await prisma.user.create({
        data: {
            ...user,
            password: hashedPassword,
            countryId: Number(user.countryId),
        },
    });

    return createdUser;
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
            refreshToken: user.refreshToken || undefined,
        },
    });

    return updatedUser;
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
    findByPasswordResetHash,
    create,
    update,
    updatePasswordResetHash,
    updateAvatar,
    ban,
};
