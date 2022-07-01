import User, { UserInput } from "../models/User";

export async function findUser(body: UserInput): Promise<any> {
    try {
        const user = User.findOne({ email: body.email })

        if (!user) return false

        return user
    } catch (e: any) {
        throw new Error(e)
    }
}
