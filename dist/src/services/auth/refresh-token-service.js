"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenService = void 0;
const prisma_1 = require("../../libs/prisma");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const date_1 = require("../../utils/date");
const refreshTokenService = async (refreshToken) => {
    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (typeof decoded !== "object" ||
        !("sub" in decoded) ||
        !("jti" in decoded)) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
    const payload = decoded;
    const userId = Number(payload.sub);
    if (Number.isNaN(userId)) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
    const storedToken = await prisma_1.prisma.refreshToken.findUnique({
        where: { jti: payload.jti },
    });
    if (!storedToken || storedToken.revoked) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
    const isValid = await (0, bcryptjs_1.compare)(refreshToken, storedToken.tokenHash);
    if (!isValid) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        await tx.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        });
        const newJti = (0, crypto_1.randomBytes)(16).toString("hex");
        const newRefreshToken = jsonwebtoken_1.default.sign({ sub: String(userId), jti: newJti }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        await tx.refreshToken.create({
            data: {
                jti: newJti,
                tokenHash: await (0, bcryptjs_1.hash)(newRefreshToken, 10),
                expiresAt: (0, date_1.addDays)(new Date(), 7),
                user: {
                    connect: { id: userId },
                },
            },
        });
        const accessToken = jsonwebtoken_1.default.sign({ sub: String(userId) }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        return { accessToken, refreshToken: newRefreshToken };
    });
};
exports.refreshTokenService = refreshTokenService;
