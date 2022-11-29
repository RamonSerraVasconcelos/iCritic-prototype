import { Role } from '@prisma/client';

export interface UserProps {
    id: number;
    name: string;
    email: string;
    password: string;
    description: string;
    role: Role;
    passwordResetHash: string;
    passwordResetDate: number;
    countryId: number;
    createdAt: Date;
    updatedAt: Date;
}
