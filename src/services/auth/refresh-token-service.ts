import { prisma } from "@/libs/prisma"
import { hash, compare } from "bcryptjs"
import jwt from "jsonwebtoken"
import { randomBytes } from "crypto"

export const refreshTokenService = async (refreshToken: string) => {
    const storedTokens = await prisma.refreshToken.findMany({
        where: {
            revoked: false,
            expiresAt: { gt: new Date() },
        },
        include: {
            user: true,
        },
    })
    let matchedToken = null

    for (const token of storedTokens) {
        const isMatch = await compare(refreshToken, token.tokenHash)
        if (isMatch) {
            matchedToken = token
            break
        }
    }

    if (!matchedToken) {
        throw new Error("REFRESH_TOKEN_INVALID")
    }

    await prisma.refreshToken.update({
        where: { id: matchedToken.id },
        data: { revoked: true },
    })

    const accessToken = jwt.sign(
        { sub: matchedToken.userId },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
    )

    const newRefreshToken = randomBytes(64).toString("hex")
    const newRefreshTokenHash = await hash(newRefreshToken, 10)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.refreshToken.create({
        data: {
            tokenHash: newRefreshTokenHash,
            userId: matchedToken.userId,
            expiresAt,
        },
    })

    return {
        accessToken,
        refreshToken: newRefreshToken,
    }
}