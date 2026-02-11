import { prisma } from "@/libs/prisma"
import { hash, compare } from "bcryptjs"
import jwt from "jsonwebtoken"
import { randomBytes } from "crypto"
import { RefreshTokenPayload } from "@/types/jwt-payload"
import { addDays } from "@/utils/date"


export const refreshTokenService = async (refreshToken: string) => {
    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
    )

    if (
        typeof decoded !== "object" ||
        !("sub" in decoded) ||
        !("jti" in decoded)
    ) {
        throw new Error("INVALID_REFRESH_TOKEN")
    }

    const payload = decoded as RefreshTokenPayload
    const userId = Number(payload.sub)

    if (Number.isNaN(userId)) {
        throw new Error("INVALID_REFRESH_TOKEN")
    }

    const storedToken = await prisma.refreshToken.findUnique({
        where: { jti: payload.jti },
    })

    if (!storedToken || storedToken.revoked) {
        throw new Error("INVALID_REFRESH_TOKEN")
    }

    const isValid = await compare(refreshToken, storedToken.tokenHash)
    if (!isValid) {
        throw new Error("INVALID_REFRESH_TOKEN")
    }

    return prisma.$transaction(async (tx) => {
        await tx.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        })

        const newJti = randomBytes(16).toString("hex")

        const newRefreshToken = jwt.sign(
            { sub: String(userId), jti: newJti },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" }
        )

        await tx.refreshToken.create({
            data: {
                jti: newJti,
                tokenHash: await hash(newRefreshToken, 10),
                expiresAt: addDays(new Date(), 7),
                user: {
                    connect: { id: userId },
                },
            },
        })

        const accessToken = jwt.sign(
            { sub: String(userId) },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        )

        return { accessToken, refreshToken: newRefreshToken }
    })
}