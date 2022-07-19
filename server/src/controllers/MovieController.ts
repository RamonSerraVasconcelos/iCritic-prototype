import { Request, Response } from 'express'

const MovieController = {
    list(req: Request, res: Response) {
        return res.send('test')
    }
}

export default MovieController