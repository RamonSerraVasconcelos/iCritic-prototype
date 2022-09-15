export {};

export interface User {
    id: String;
    name: String;
    email: String;
    password: String;
    refresh_token: String;
    role: String;
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
