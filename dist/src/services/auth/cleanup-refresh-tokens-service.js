"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupRefreshTokensService = void 0;
const prisma_1 = require("../../libs/prisma");
const cleanupRefreshTokensService = async () => {
    const now = new Date();
    const result = await prisma_1.prisma.refreshToken.deleteMany({
        where: {
            OR: [
                { revoked: true },
                { expiresAt: { lt: now } },
            ],
        },
    });
    return result.count;
};
exports.cleanupRefreshTokensService = cleanupRefreshTokensService;
