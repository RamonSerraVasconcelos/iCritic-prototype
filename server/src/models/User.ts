import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
interface IUser extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    let user = this as IUser

    if (!user.isModified("password")) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)

    const hash = await bcrypt.hashSync(user.password, salt)

    user.password = hash
    return next()
})

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const user = this as IUser

    return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
};

const User = mongoose.model<IUser>("User", userSchema)
export interface UserInput {
    email: string;
    name: string;
    password: string;
}

export default User