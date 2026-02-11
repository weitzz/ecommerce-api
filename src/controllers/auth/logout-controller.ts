import { RequestHandler } from "express"
import { logoutService } from "@/services/auth/logout-service"
import { HttpStatus } from "@/shared/http/status-codes"

export const logoutController: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
        await logoutService(refreshToken)
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/refresh",

    })

    return res.sendStatus(HttpStatus.NO_CONTENT)
}
