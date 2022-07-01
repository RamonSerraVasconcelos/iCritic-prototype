import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers["authorization"]) return res.status(401).send({
        success: false,
        message: "User not authorized"
    })
}

export default userAuth