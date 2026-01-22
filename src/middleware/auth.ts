import { GetUserByIdTokenService } from "@/services/user-service"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {

    const authHeader = request.headers.authorization
    if (!authHeader) {
        return response.status(401).json({ error: "Access denied" })
    }

    const token = authHeader.replace("Bearer ", "")

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { id: number; email: string }

        request.user = decoded
        next()
    } catch {
        return response.status(401).json({ error: "Invalid token" })
    }

}