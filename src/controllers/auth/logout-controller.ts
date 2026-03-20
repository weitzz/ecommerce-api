import { RequestHandler } from "express"
import { logoutService } from "@/services/auth/logout-service"
import { HttpStatus } from "@/shared/http/status-codes"
import { getRefreshCookieOptions } from "@/libs/cookie"

export const logoutController: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
        await logoutService(refreshToken)
    }

    res.clearCookie("refreshToken",
        getRefreshCookieOptions()
    )

    return res.sendStatus(HttpStatus.NO_CONTENT)
}
