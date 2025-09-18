import { GetUserByIdTokenService } from "@/services/user-service"
import { NextFunction, Request, Response } from "express"
export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers["authorization"]
    if (!authHeader) {
        return response.status(401).json({ error: "Access denied" })
    }

    const tokenSplit = authHeader.split('Bearer ')
    if (!tokenSplit) {
        return response.status(401).json({ error: "Access denied" })
    }

    const token = tokenSplit[1]
    const userId = await GetUserByIdTokenService(token)

    if (!userId) {
        return response.status(401).json({ error: "Access denied" })
    }

    (request as any).userId = userId
    next()
}