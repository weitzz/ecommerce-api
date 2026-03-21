"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = void 0;
const prisma_1 = require("../../libs/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logoutService = async (refreshToken) => {
    let payload;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (typeof decoded !== "object" ||
            !("jti" in decoded)) {
            return;
        }
        payload = decoded;
    }
    catch {
        return;
    }
    await prisma_1.prisma.refreshToken.updateMany({
        where: {
            jti: payload.jti,
            revoked: false,
        },
        data: { revoked: true },
    });
};
exports.logoutService = logoutService;
