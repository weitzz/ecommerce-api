export const getBaseUrl = () => {
    return (
        process.env.API_URL || process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`
    )
}
