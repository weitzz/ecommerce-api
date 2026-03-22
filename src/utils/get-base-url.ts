export const getBaseUrl = () => {
    const baseUrl = process.env.API_URL ?? process.env.APP_URL

    if (!baseUrl) {
        console.warn("⚠️ API_URL/BASE_URL não definida, usando localhost")
    }

    return baseUrl ?? `http://localhost:${process.env.PORT || "8080"}`;
}
