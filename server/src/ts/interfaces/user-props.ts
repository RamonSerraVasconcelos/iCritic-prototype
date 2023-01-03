import { Role } from '@prisma/client';

export interface UserProps {
    id: number;
    name: string;
    email: string;
    password: string;
    description: string;
    role: Role;
    passwordResetHash?: string | null;
    passwordResetDate: Date;
    active: boolean;
    countryId: number;
    createdAt: Date;
    updatedAt: Date;
}
