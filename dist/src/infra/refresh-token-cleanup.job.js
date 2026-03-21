"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRefreshTokenCleanupJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const cleanup_refresh_tokens_service_1 = require("../services/auth/cleanup-refresh-tokens-service");
const startRefreshTokenCleanupJob = () => {
    node_cron_1.default.schedule("0 3 * * *", async () => {
        try {
            const deleted = await (0, cleanup_refresh_tokens_service_1.cleanupRefreshTokensService)();
            console.log(`[RefreshTokenCleanup] ${deleted} tokens removidos`);
        }
        catch (error) {
            console.error("[RefreshTokenCleanup] erro:", error);
        }
    });
};
exports.startRefreshTokenCleanupJob = startRefreshTokenCleanupJob;
