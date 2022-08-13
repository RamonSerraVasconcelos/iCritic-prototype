import { hash } from 'bcrypt';
import prisma from '@src/config/prisma-client';
import ResponseError from '@src/ts/classes/response-error';

interface UserData {
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

    if (duplicate)
        throw new ResponseError('This email is already registered!', 409);

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
    findById,
    findByEmail,
};
