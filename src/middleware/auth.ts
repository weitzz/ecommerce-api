import { NextFunction, Request, Response } from "express"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { JwtPayload } from "../types/jwt-payload"
import { AppError } from "@/shared/errors/app-error"
import { HttpStatus } from "@/shared/http/status-codes"

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {

    const authHeader = request.headers.authorization
    if (!authHeader) {
        throw new AppError(
            "Usuário não autenticado",
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
        if (err instanceof TokenExpiredError) {
            throw new AppError(
                "Token expirado",
                "AUTH_TOKEN_EXPIRED",
                HttpStatus.UNAUTHORIZED
            )
        }
        if (err instanceof JsonWebTokenError) {
            throw new AppError(
                "Token inválido",
                "AUTH_TOKEN_INVALID",
                HttpStatus.UNAUTHORIZED
            )
        }

        throw new AppError(
            "Erro de autenticação",
            "AUTH_UNKNOWN_ERROR",
            HttpStatus.UNAUTHORIZED
        )
    }

}