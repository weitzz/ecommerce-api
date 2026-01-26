import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../types/jwt-payload"

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {

    const authHeader = request.headers.authorization
    if (!authHeader) {
        return response.status(401).json({ error: "Token não fornecido" })
    }

    const [token] = authHeader.split(" ")

    if (!token) {
        return response.status(401).json({ error: "Token mal formatado" })
    }


    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload

        request.user = decoded
        next()
    } catch {
        return response.status(401).json({ error: "Token inválido ou expirado" })
    }

}