import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.token || ''

    if (!token) return res.status(401).send({
        message: "Unauthorized"
    })

    jwt.verify(token, <string>process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({
                message: "User unauthorized"
            })
        }

        req.user = user
        next()
    })
}

const userAuthRefresh = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken: string = req.cookies.refreshToken || ''

    if (!refreshToken) return res.status(401).send({
        message: "Unauthorized"
    })

    jwt.verify(refreshToken, <string>process.env.JWT_RERESH_SECRET, (err: any, token: any) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized"
            })
        }

        req.user = token.user
        next()
    })
}

export { userAuth, userAuthRefresh }