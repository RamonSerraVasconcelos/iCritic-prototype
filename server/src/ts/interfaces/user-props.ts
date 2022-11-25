import { Role } from '@prisma/client';

export interface UserProps {
    id: number;
    name: string;
    email: string;
    password: string;
    description: string;
    role: Role;
    passwordResetHash: string;
    passwordResetDate: Date;
    countryId: number;
    createdAt: Date;
    updatedAt: Date;
}
