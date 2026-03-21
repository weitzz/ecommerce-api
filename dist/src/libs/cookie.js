"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshCookieOptions = void 0;
const getRefreshCookieOptions = () => {
    const isProd = process.env.NODE_ENV === "production";
    const domain = process.env.COOKIE_DOMAIN?.trim();
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        ...(domain ? { domain } : {}),
        maxAge: 1000 * 60 * 60 * 24 * 7
    };
};
exports.getRefreshCookieOptions = getRefreshCookieOptions;
