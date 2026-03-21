"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = void 0;
const refresh_token_service_1 = require("../../services/auth/refresh-token-service");
const app_error_1 = require("../../shared/errors/app-error");
const status_codes_1 = require("../../shared/http/status-codes");
const cookie_1 = require("../../libs/cookie");
const refreshTokenController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new app_error_1.AppError("Refresh token ausente", "REFRESH_TOKEN_MISSING", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    try {
        const result = await (0, refresh_token_service_1.refreshTokenService)(refreshToken);
        res.cookie("refreshToken", result.refreshToken, (0, cookie_1.getRefreshCookieOptions)());
        return res.status(status_codes_1.HttpStatus.OK).json({
            success: true,
            data: {
                accessToken: result.accessToken
            }
        });
    }
    catch {
        throw new app_error_1.AppError("Refresh token inválido ou expirado", "REFRESH_TOKEN_INVALID", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
};
exports.refreshTokenController = refreshTokenController;
