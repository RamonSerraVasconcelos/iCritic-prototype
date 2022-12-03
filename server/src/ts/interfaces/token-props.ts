import { Role } from '@prisma/client';

export interface TokenProps {
    user: {
        id: number;
        name: string;
        role: Role;
    };
}
