import { cleanupRefreshTokensService } from "@/services/auth/cleanup-refresh-tokens-service"
import { prisma } from "@/libs/prisma"

jest.mock("@/libs/prisma", () => ({
    prisma: {
        refreshToken: {
            deleteMany: jest.fn(),
        },
    },
}))

describe("cleanupRefreshTokensService", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });

    it("deve deletar tokens revogados ou expirados e retornar count", async () => {
        (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
            count: 5,
        });

        const result = await cleanupRefreshTokensService()

        expect(prisma.refreshToken.deleteMany).toHaveBeenCalledTimes(1)

        const callArgs = (prisma.refreshToken.deleteMany as jest.Mock).mock.calls[0][0]

        expect(callArgs).toHaveProperty("where.OR")
        expect(callArgs.where.OR).toEqual(
            expect.arrayContaining([
                { revoked: true },
                expect.objectContaining({
                    expiresAt: expect.objectContaining({
                        lt: expect.any(Date),
                    }),
                }),
            ])
        )

        expect(result).toBe(5)
    });

    it("deve propagar erro caso prisma falhe", async () => {
        (prisma.refreshToken.deleteMany as jest.Mock).mockRejectedValue(
            new Error("database error")
        );

        await expect(cleanupRefreshTokensService()).rejects.toThrow("database error")
    });
})
