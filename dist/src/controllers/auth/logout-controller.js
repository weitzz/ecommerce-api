"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = void 0;
const logout_service_1 = require("../../services/auth/logout-service");
const status_codes_1 = require("../../shared/http/status-codes");
const cookie_1 = require("../../libs/cookie");
const logoutController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        await (0, logout_service_1.logoutService)(refreshToken);
    }
    res.clearCookie("refreshToken", (0, cookie_1.getRefreshCookieOptions)());
    return res.sendStatus(status_codes_1.HttpStatus.NO_CONTENT);
};
exports.logoutController = logoutController;
