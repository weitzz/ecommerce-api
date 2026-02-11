import { RequestHandler } from "express"
import { refreshTokenService } from "@/services/auth/refresh-token-service"
import { AppError } from "@/shared/errors/app-error"
import { HttpStatus } from "@/shared/http/status-codes"

export const refreshTokenController: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken
    console.log("cookies:", req.cookies)
    if (!refreshToken) {
        throw new AppError(
            "Refresh token ausente",
            "REFRESH_TOKEN_MISSING",
            HttpStatus.UNAUTHORIZED
        )
    }

    try {
        const result = await refreshTokenService(refreshToken)

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/auth/refresh",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })

        return res.status(HttpStatus.OK).json({
            success: true
        })


    } catch {
        throw new AppError(
            "Refresh token inválido ou expirado",
            "REFRESH_TOKEN_INVALID",
            HttpStatus.UNAUTHORIZED
        )
    }
}
