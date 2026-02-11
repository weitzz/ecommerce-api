import rateLimit, { Options, ipKeyGenerator } from "express-rate-limit"
import { AppError } from "@/shared/errors/app-error"
import { HttpStatus } from "@/shared/http/status-codes"

type KeyGenerator = NonNullable<Options["keyGenerator"]>

export const createRateLimiter = (
    max: number,
    windowMs: number,
    keyGenerator?: KeyGenerator
) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator,
        handler: (req, res) => {
            res.status(HttpStatus.TOO_MANY_REQUESTS).json({
                success: false,
                code: "RATE_LIMIT_EXCEEDED",
                message: "Muitas requisições. Tente novamente mais tarde."
            })
        },
    })
}

export const loginRateLimit = createRateLimiter(
    5,
    15 * 60 * 1000
)

export const refreshRateLimit = createRateLimiter(
    10,
    60 * 1000
)

export const logoutRateLimit = createRateLimiter(
    20,
    60 * 1000
)

export const authenticatedRateLimit = createRateLimiter(
    100,
    15 * 60 * 1000,
    (req) => {
        if (req.user?.id) {
            return `user:${req.user.id}`
        }

        return ipKeyGenerator(req.ip)
    }
)