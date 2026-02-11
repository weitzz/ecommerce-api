import { prisma } from "@/libs/prisma"
import { refreshTokenService } from "@/services/auth/refresh-token-service"
import { compare, hash } from "bcryptjs"
import * as jwt from "jsonwebtoken"

jest.mock("@/libs/prisma", () => ({
    prisma: {
        refreshToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));


jest.mock("bcryptjs", () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

describe("refreshTokenService", () => {
    const mockRefreshToken = "valid-refresh-token"
    const mockUserId = 1
    const mockJti = "old-jti"

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it("deve rotacionar refresh token com sucesso", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: String(mockUserId),
            jti: mockJti,
        });

        (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
            id: 10,
            userId: mockUserId,
            tokenHash: "hashed-token",
            revoked: false,
        });

        (compare as jest.Mock).mockResolvedValue(true);

        (jwt.sign as jest.Mock)
            .mockReturnValueOnce("new-refresh-token")
            .mockReturnValueOnce("new-access-token");

        (hash as jest.Mock).mockResolvedValue("new-hash");

        (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
            return cb({
                refreshToken: {
                    update: jest.fn(),
                    create: jest.fn(),
                },
            })
        });

        const result = await refreshTokenService(mockRefreshToken);
        expect(result).toEqual({
            accessToken: "new-access-token",
            refreshToken: "new-refresh-token",
        });
    });

    it("deve lançar erro se token não existir no banco", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: String(mockUserId),
            jti: mockJti,
        });

        (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(refreshTokenService(mockRefreshToken)).rejects.toThrow("INVALID_REFRESH_TOKEN");
    });

    it("deve lançar erro se token estiver revogado", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: String(mockUserId),
            jti: mockJti,
        });

        (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
            id: 10,
            revoked: true,
        });

        await expect(refreshTokenService(mockRefreshToken)).rejects.toThrow("INVALID_REFRESH_TOKEN");
    });

    it("deve lançar erro se hash não bater", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: String(mockUserId),
            jti: mockJti,
        });

        (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
            id: 10,
            tokenHash: "hashed-token",
            revoked: false,
        });

        (compare as jest.Mock).mockResolvedValue(false);

        await expect(refreshTokenService(mockRefreshToken)).rejects.toThrow("INVALID_REFRESH_TOKEN");
    });

    it("deve lançar erro se payload inválido", async () => {
        (jwt.verify as jest.Mock).mockReturnValue("invalid");

        await expect(refreshTokenService(mockRefreshToken)).rejects.toThrow("INVALID_REFRESH_TOKEN")
    });
})
