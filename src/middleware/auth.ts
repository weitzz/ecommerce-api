import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../types/jwt-payload"
import { AppError } from "@/shared/errors/app-error"
import { HttpStatus } from "@/shared/http/status-codes"

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {

    const authHeader = request.headers.authorization
    if (!authHeader) {
        throw new AppError(
            "Token não fornecido",
            "AUTH_TOKEN_MISSING",
            HttpStatus.UNAUTHORIZED
        )
    }

    const [type, token] = authHeader.split(" ")

    if (type !== "Bearer" || !token) {
        throw new AppError(
            "Token mal formatado",
            "AUTH_TOKEN_INVALID_FORMAT",
            HttpStatus.UNAUTHORIZED
        )
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload

        request.user = decoded
        next()
    } catch (err) {
        throw new AppError(
            "Token inválido ou expirado",
            "AUTH_TOKEN_INVALID",
            HttpStatus.UNAUTHORIZED
        )
    }

}