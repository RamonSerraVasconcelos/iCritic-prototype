import { Request, Response } from 'express'
import { createUser } from "../services/UserService"

const UserController = {
    async register(req: Request, res: Response) {
        try {
            const user = await createUser(req.body)
        } catch (error) {
            console.error(error)
            res.status(500).send({
                message: "An unexpected error occurred"
            })
        }
    }
}

export default UserController