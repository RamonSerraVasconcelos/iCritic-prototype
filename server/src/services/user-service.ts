import { hash } from 'bcrypt';
import prisma from '@src/config/prisma-client';
// import { Role } from '@src/ts/enums/roles';
import { Role } from '@prisma/client';

interface UserData {
    id: number;
    name: string;
    email: string;
    password: string;
    profilePic: string;
    description: string;
    countryId: number;
    passwordReset: string;
    passwordResetDate: number;
}

const create = async ({ name, email, password, description, countryId }: UserData) => {
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

const update = async (user: UserData) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(user.id),
        },
        data: {
            name: user.name || undefined,
            email: user.email || undefined,
            description: user.description || undefined,
            countryId: Number(user.countryId) || undefined,
            passwordResetHash: user.passwordReset || undefined,
            passwordResetDate: user.passwordResetDate || undefined,
        },
    });

    return updatedUser;
};

const updatePassword = async (id: number, password: string) => {
    const hashedPassword = await hash(password, 10);

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            password: hashedPassword,
        },
    });

    return updatedUser;
};

const updateProfilePic = async (id: number, imageId: number) => {
    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            imageId,
        },
    });

    return updatedUser;
};

const updateUserRole = async (id: number, role: Role) => {
    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            role,
        },
    });

    return updatedUser;
};

const updateUserStatus = async (id: number, active: boolean) => {
    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            active,
        },
    });

    return updatedUser;
};

const insertBan = async (id: number, motive: string) => {
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
        where: { id },
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
    updateProfilePic,
    updateUserRole,
    updateUserStatus,
    insertBan,
    find,
    findById,
    findByEmail,
};
