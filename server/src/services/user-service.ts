import { hash } from 'bcrypt';
import prisma from '@src/config/prisma-client';

interface UserData {
    id: string;
    name: string;
    email: string;
    password: string;
    profilePic: string;
    description: string;
    countryId: string;
    passwordReset: string;
    passwordResetDate: number;
}

enum Role {
    ADMIN,
    MODERATOR,
    USER,
}

enum Status {
    ACTIVE,
    BANNED,
}

const create = async ({ name, email, password, description, countryId }: UserData) => {
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            description: description || undefined,
            countryId: countryId || undefined,
        },
    });

    return user;
};

const update = async (user: UserData) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            name: user.name || undefined,
            email: user.email || undefined,
            description: user.description || undefined,
            countryId: user.countryId || undefined,
            passwordReset: user.passwordReset || undefined,
            passwordResetDate: user.passwordResetDate || undefined,
        },
    });

    return updatedUser;
};

const updatePassword = async (id: string, password: string) => {
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

const updateProfilePic = async (id: string, profilePic: string) => {
    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            profilePic,
        },
    });

    return updatedUser;
};

const updateUserRole = async (id: string, role: string) => {
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

const updateUserStatus = async (id: string, status: string) => {
    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });

    return updatedUser;
};

const insertBan = async (id: string, motive: string) => {
    const insertedBan = await prisma.banlist.create({
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

const findById = async (id: string) => {
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
