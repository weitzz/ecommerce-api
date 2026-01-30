import { Request, Response, NextFunction } from "express"
import { AppError } from "./app-error"

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                code: err.code,
                details: err.details,
            },
        })
    }


    return res.status(500).json({
        success: false,
        error: {
            message: "Erro interno do servidor",
            code: "INTERNAL_SERVER_ERROR",
        },
    })
}
