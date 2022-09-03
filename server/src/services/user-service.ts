import { hash } from 'bcrypt';
import prisma from '@src/config/prisma-client';
import ResponseError from '@src/ts/classes/response-error';

interface UserData {
    id: string;
    name: string;
    email: string;
    password: string;
    profilePic: string;
}

const create = async ({ name, email, password }: UserData) => {
    const hashedPassword = await hash(password, 10);

    const duplicate = await prisma.user.findUnique({
        where: { email },
    });

    if (duplicate) throw new ResponseError('This email is already registered!', 409);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profilePic: '',
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

    if (!user) throw new ResponseError('User not found!', 404);

    return user;
};

const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) throw new ResponseError('Invalid email or password!', 401);

    return user;
};

export default {
    create,
    update,
    find,
    findById,
    findByEmail,
};
