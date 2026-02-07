import { prisma } from "@/libs/prisma"
import { compare } from "bcryptjs"

export const logoutService = async (refreshToken: string) => {
    const storedTokens = await prisma.refreshToken.findMany({
        where: {
            revoked: false,
            expiresAt: { gt: new Date() },
        },
    })

    for (const token of storedTokens) {
        const isMatch = await compare(refreshToken, token.tokenHash)

        if (isMatch) {
            await prisma.refreshToken.update({
                where: { id: token.id },
                data: { revoked: true },
            })
            return
        }
    }

}
