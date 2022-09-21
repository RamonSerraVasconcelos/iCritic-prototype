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
    updateProfilePic,
    find,
    findById,
    findByEmail,
};
