import { prisma } from "@/libs/prisma"

export const cleanupRefreshTokensService = async () => {
    const now = new Date()

    const result = await prisma.refreshToken.deleteMany({
        where: {
            OR: [
                { revoked: true },
                { expiresAt: { lt: now } },
            ],
        },
    })

    return result.count
}
