export const getRefreshCookieOptions = () => {
    const isProd = process.env.NODE_ENV === "production"
    const domain = process.env.COOKIE_DOMAIN?.trim()

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" as const : "lax" as const,
        path: "/",
        ...(domain ? { domain } : {}),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
