const normalizeUrl = (url: string) => url.trim().replace(/\/+$/, "");

export const getFrontEndUrl = () => {
    const configuredUrl = [
        process.env.FRONT_END_URL,
        process.env.FRONTEND_URL,
        process.env.NEXT_PUBLIC_FRONT_END_URL,
        process.env.NEXT_PUBLIC_APP_URL,
    ].find((value) => typeof value === "string" && value.trim().length > 0);

    if (configuredUrl) {
        return normalizeUrl(configuredUrl);
    }

    if (process.env.NODE_ENV !== "production") {
        return "http://localhost:3000";
    }

    throw new Error(
        "Front-end URL is not configured. Set FRONT_END_URL in production."
    );
}
