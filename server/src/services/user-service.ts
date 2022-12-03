import { hash } from 'bcrypt';
import { UserProps } from '@src/ts/interfaces/user-props';
import { Role } from '@prisma/client';
import { prisma, excludeFields } from '@src/config/prisma-client';

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

const updateRefreshToken = async (
    userId: number,
    refreshToken: string | null,
) => {
    await prisma.user.update({
        data: {
            refreshToken,
        },
        where: {
            id: userId,
        },
    });
};

const update = async (user: UserProps) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            name: user.name || undefined,
            email: user.email || undefined,
            description: user.description || undefined,
            countryId: user.countryId || undefined,
            passwordResetHash: user.passwordResetHash || undefined,
            passwordResetDate: user.passwordResetDate || undefined,
        },
    });

    return updatedUser;
};

const updatePassword = async (userId: number, password: string) => {
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });

    return user;
};

const updateImage = async (userId: number, imagePath: string) => {
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

const updateRole = async (userId: number, role: Role) => {
    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role,
        },
    });

    return user;
};

const updateStatus = async (userId: number, active: boolean) => {
    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            active,
        },
    });

    return user;
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

const ban = async (userId: number, motive: string) => {
    const insertedBan = await prisma.banList.create({
        data: {
            userId,
            motive,
        },
    });

    return insertedBan;
};

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

export const userService = {
    create,
    update,
    updateRefreshToken,
    updatePasswordResetHash,
    updatePassword,
    updateImage,
    updateRole,
    updateStatus,
    ban,
    list,
    findById,
    findByEmail,
    findByRefreshToken,
    findByPasswordResetHash,
};
