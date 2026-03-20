import { RequestHandler } from "express"
import { refreshTokenService } from "@/services/auth/refresh-token-service"
import { AppError } from "@/shared/errors/app-error"
import { HttpStatus } from "@/shared/http/status-codes"
import { getRefreshCookieOptions } from "@/libs/cookie"

export const refreshTokenController: RequestHandler = async (req, res) => {

    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
        throw new AppError(
            "Refresh token ausente",
            "REFRESH_TOKEN_MISSING",
            HttpStatus.UNAUTHORIZED
        )
    }

    try {
        const result = await refreshTokenService(refreshToken)

        res.cookie("refreshToken",
            result.refreshToken,
            getRefreshCookieOptions())

        return res.status(HttpStatus.OK).json({
            success: true,
            data: {
                accessToken: result.accessToken
            }
        })


    } catch {
        throw new AppError(
            "Refresh token inválido ou expirado",
            "REFRESH_TOKEN_INVALID",
            HttpStatus.UNAUTHORIZED
        )
    }
}
