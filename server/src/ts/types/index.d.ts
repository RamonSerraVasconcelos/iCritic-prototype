export {};

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    description: string;
    countryId: string;
    profilePic: string;
    resetHash: string;
    resetHashDate: Number;
    role: string;
    created_at: string;
    updated_at: string;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}
