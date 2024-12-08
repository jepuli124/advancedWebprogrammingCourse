import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

interface CustomRequest extends Request {
    user?: JwtPayload
}

export const validateToken = (req: any, res: any, next: NextFunction) => {
    const token: string | undefined = req.header('authorization')?.split(" ")[1]
    console.log("validating token")
    if(!token) return res.status(401).json({message: "Missing token"})

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.body.user = verified
        console.log("going to next()")
        next()

    } catch (error: any) {
        res.status(401).json({message: "Missing token"})
    }
}