import { Request, Response } from 'express'
import User from '../models/User'

const UserController = {
    register(req: Request, res: Response) {
        return res.send()
    }
}

export default UserController