import { Role } from '@prisma/client';

export interface DecodedProps {
    user: {
        id: number;
        name: string;
        role: Role;
    };
}
