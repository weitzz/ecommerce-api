export const getRefreshCookieOptions = () => {
    const isProd = process.env.NODE_ENV === "production"

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" as const : "lax" as const,
        path: "/",
        domain: "localhost",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}