"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedRateLimit = exports.logoutRateLimit = exports.refreshRateLimit = exports.loginRateLimit = exports.createRateLimiter = void 0;
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
const status_codes_1 = require("../shared/http/status-codes");
const createRateLimiter = (max, windowMs, keyGenerator) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator,
        handler: (req, res) => {
            res.status(status_codes_1.HttpStatus.TOO_MANY_REQUESTS).json({
                success: false,
                code: "RATE_LIMIT_EXCEEDED",
                message: "Muitas requisições. Tente novamente mais tarde."
            });
        },
    });
};
exports.createRateLimiter = createRateLimiter;
exports.loginRateLimit = (0, exports.createRateLimiter)(5, 15 * 60 * 1000);
exports.refreshRateLimit = (0, exports.createRateLimiter)(10, 60 * 1000);
exports.logoutRateLimit = (0, exports.createRateLimiter)(20, 60 * 1000);
exports.authenticatedRateLimit = (0, exports.createRateLimiter)(100, 15 * 60 * 1000, (req) => {
    if (req.user?.id) {
        return `user:${req.user.id}`;
    }
    return (0, express_rate_limit_1.ipKeyGenerator)(req.ip || req.socket.remoteAddress || "");
});
