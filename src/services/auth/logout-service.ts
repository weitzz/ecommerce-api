import { prisma } from "@/libs/prisma"
import jwt from "jsonwebtoken"
import { RefreshTokenPayload } from "@/types/jwt-payload"

export const logoutService = async (refreshToken: string) => {
    let payload: RefreshTokenPayload
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        )

        if (
            typeof decoded !== "object" ||
            !("jti" in decoded)
        ) {
            return
        }

        payload = decoded as RefreshTokenPayload
    } catch {
        return
    }

    await prisma.refreshToken.updateMany({
        where: {
            jti: payload.jti,
            revoked: false,
        },
        data: { revoked: true },
    })
}
