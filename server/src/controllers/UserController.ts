import { Request, Response } from 'express'
import User from '../models/User'

const UserController = {
    register(req: Request, res: Response) {
        try {
            return res.send('sexo online')
        } catch (error) {
            console.error(error)
            res.status(500).send({
                message: "An unexpected error occurred"
            })
        }
    }
}

export default UserController