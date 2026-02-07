import cron from "node-cron"
import { cleanupRefreshTokensService } from "@/services/auth/cleanup-refresh-tokens-service"

export const startRefreshTokenCleanupJob = () => {
    cron.schedule("0 3 * * *", async () => {
        try {
            const deleted = await cleanupRefreshTokensService()
            console.log(`[RefreshTokenCleanup] ${deleted} tokens removidos`)
        } catch (error) {
            console.error("[RefreshTokenCleanup] erro:", error)
        }
    })
}
