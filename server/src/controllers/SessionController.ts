import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findUser } from "../services/SessionService"

const SessionController = {
    async login(req: Request, res: Response) {
        try {
            if (!req.body.email || req.body.email == "" || !req.body.password || req.body.password == "") {
                return res.status(422).send({
                    message: "All fields are required"
                })
            }

            const user = await findUser(req.body)

            if (!user) return res.status(404).send({
                message: "Invalid email or password"
            })

            if (!await bcrypt.compare(req.body.password, user.password)) return res.status(404).send({
                message: "Invalid email or password"
            })

            delete user._doc.password

            const token = jwt.sign(user.toJSON(), <string>process.env.JWT_SECRET, { expiresIn: "15m" })
            const refreshToken = jwt.sign({ user }, <string>process.env.JWT_RERESH_SECRET, { expiresIn: "7d" })

            return res.status(200).send({
                token,
                refreshToken
            })
        } catch (e: any) {
            console.error(e)
            res.status(500).send({
                success: false,
                message: "An unexpected error occurred"
            })
        }
    },
    async refresh(req: Request, res: Response) {

    }
}

export default SessionController