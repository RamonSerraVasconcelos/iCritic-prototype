import { Request, Response } from 'express'
import { createUser } from "../services/UserService"

const UserController = {
    async register(req: Request, res: Response) {
        try {

            if (!req.body.email || !req.body.name || !req.body.password) {
                return res.status(422).send({
                    message: "All fields are required"
                })
            }

            if (req.body.email == "" || req.body.name == "" || req.body.password == "") {
                return res.status(422).send({
                    message: "All fields are required"
                })
            }

            if (!await createUser(req.body)) {
                return res.status(500).send({
                    message: "An unexpected error occured"
                })
            }

            res.status(201).send({
                message: "User created"
            })
        } catch (error) {
            console.error(error)
            res.status(500).send({
                message: "An unexpected error occurred"
            })
        }
    }
}

export default UserController