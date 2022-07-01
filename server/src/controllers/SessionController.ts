import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { findUser } from "../services/SessionService"

const SessionController = {
    async login(req: Request, res: Response) {
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
    },
    async refresh(req: Request, res: Response) {

    }
}

export default SessionController