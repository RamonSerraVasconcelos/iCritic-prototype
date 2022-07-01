import User, { UserInput } from "../models/User";

export async function createUser(input: UserInput) {
    try {
        if (!await User.create(input)) return false

        return true
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function findOneByEmail(input: UserInput) {
    try {
        const user = await User.findOne({ email: input.email })

        if (!user) {
            return false
        }

        return user.toJSON()
    } catch (e: any) {
        throw new Error(e);
    }
}