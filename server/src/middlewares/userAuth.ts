import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers["authorization"]) return res.status(401).send({
        message: "User unauthorized"
    })

    let token: string = req.headers["authorization"]
    token = token.split(" ")[1]

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
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send({
        message: "User unauthorized"
    })

    jwt.verify(refreshToken, <string>process.env.JWT_RERESH_SECRET, (err: any, token: any) => {
        if (err) {
            return res.status(401).send({
                message: "User unauthorized"
            })
        }

        req.user = token.user
        next()
    })
}

export { userAuth, userAuthRefresh }