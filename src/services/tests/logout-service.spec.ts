import { logoutService } from "@/services/auth/logout-service"
import { prisma } from "@/libs/prisma"
import * as jwt from "jsonwebtoken"

jest.mock("@/libs/prisma", () => ({
    prisma: {
        refreshToken: {
            updateMany: jest.fn(),
        },
    },
}))

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}))

describe("logoutService", () => {
    const mockToken = "valid-refresh-token"
    const mockJti = "test-jti"

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("deve revogar token quando JWT é válido", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({
            jti: mockJti,
        });

        (prisma.refreshToken.updateMany as jest.Mock).mockResolvedValue({
            count: 1,
        });

        await logoutService(mockToken)

        expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
            where: {
                jti: mockJti,
                revoked: false,
            },
            data: { revoked: true },
        })
    });

    it("não deve lançar erro se JWT for inválido", async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error("invalid token")
        });

        await expect(logoutService(mockToken)).resolves.toBeUndefined()

        expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled()
    });

    it("não deve fazer nada se payload não tiver jti", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: "1",
        });

        await logoutService(mockToken)

        expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled()
    });
})
