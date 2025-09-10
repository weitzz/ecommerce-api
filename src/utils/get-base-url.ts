export const getBaseUrl = () => {
    return process.env.API_URL || 'http://localhost:3333';
}