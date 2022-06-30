import User, { UserInput } from "../models/User";

export async function createUser(input: UserInput) {
    try {
        if (!await User.create(input)) return false

        return true
    } catch (e: any) {
        throw new Error(e);
    }
}