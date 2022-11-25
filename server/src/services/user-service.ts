import { hash } from 'bcrypt';
import { UserProps } from '@src/ts/interfaces/user-props';
import { Role } from '@prisma/client';
import prisma from '@src/config/prisma-client';

const create = async ({ name, email, password, description, countryId }: UserProps) => {
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            description: description || undefined,
            countryId: Number(countryId),
        },
    });

    return user;
};

const update = async (user: UserProps) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(user.id),
        },
        data: {
            name: user.name || undefined,
            email: user.email || undefined,
            description: user.description || undefined,
            countryId: Number(user.countryId) || undefined,
            passwordResetHash: user.passwordResetHash || undefined,
            passwordResetDate: user.passwordResetDate || undefined,
        },
    });

    return updatedUser;
};

const updatePassword = async (id: number, password: string) => {
    const hashedPassword = await hash(password, 10);

    const updatedUser = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            password: hashedPassword,
        },
    });

    return updatedUser;
};

const updateImage = async (id: number, imagePath: string) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            image: {
                create: {
                    path: imagePath,
                },
            },
        },
    });

    return updatedUser;
};

const updateRole = async (id: number, role: Role) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            role,
        },
    });

    return updatedUser;
};

const updateStatus = async (id: number, active: boolean) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            active,
        },
    });

    return updatedUser;
};

const ban = async (id: number, motive: string) => {
    const insertedBan = await prisma.banList.create({
        data: {
            userId: id,
            motive,
        },
    });

    return insertedBan;
};

const find = async () => {
    const users = await prisma.user.findMany();

    return users;
};

const findById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });

    return user;
};

const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user;
};

export default {
    create,
    update,
    updatePassword,
    updateImage,
    updateRole,
    updateStatus,
    ban,
    find,
    findById,
    findByEmail,
};
