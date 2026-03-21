"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const refresh_token_cleanup_job_1 = require("./infra/refresh-token-cleanup.job");
const port = Number(process.env.PORT) || 4444;
if (process.env.NODE_ENV !== "test") {
    (0, refresh_token_cleanup_job_1.startRefreshTokenCleanupJob)();
}
app_1.default.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on ${port} 👽 🤙`);
});
