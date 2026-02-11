import { NextFunction, Request, Response } from "express"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { AppError } from "@/shared/errors/app-error"
import { HttpStatus } from "@/shared/http/status-codes"

const getToken = (authorization?: string) => {
    if (!authorization) {
        throw new AppError(
            "Usuário não autenticado",
            "AUTH_TOKEN_MISSING",
            HttpStatus.UNAUTHORIZED
        )
    }

    const [type, token] = authorization.split(" ")

    if (type !== "Bearer" || !token) {
        throw new AppError(
            "Token mal formatado",
            "AUTH_TOKEN_INVALID_FORMAT",
            HttpStatus.UNAUTHORIZED
        )
    }

    return token
}

const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        )

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new AppError(
                "Token expirado",
                "AUTH_TOKEN_EXPIRED",
                HttpStatus.UNAUTHORIZED
            )
        }
        if (error instanceof JsonWebTokenError) {
            throw new AppError(
                "Token inválido",
                "AUTH_TOKEN_INVALID",
                HttpStatus.UNAUTHORIZED
            )
        }

        throw error
    }
}

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const token = getToken(request.headers.authorization)
    const decoded = verifyAccessToken(token)
    const userId = Number(decoded.sub)

    if (!userId) {
        throw new AppError(
            "Token inválido",
            "AUTH_TOKEN_INVALID",
            HttpStatus.UNAUTHORIZED
        )
    }

    request.user = {
        id: userId
    }
    return next()
}