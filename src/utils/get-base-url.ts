export const getBaseUrl = () => {
    if (!process.env.BASE_URL) {
        console.warn('⚠️ BASE_URL não definida, usando localhost')
    }
    return process.env.BASE_URL ?? 'http://localhost:3333';
}