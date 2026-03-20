import swaggerJSDoc from 'swagger-jsdoc'
import { getBaseUrl } from '@/utils/get-base-url'

const serverUrl = getBaseUrl()

export const swaggerConfig = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'Documentação da API',
        },
        servers: [
            {
                url: serverUrl,
                description:
                    process.env.NODE_ENV === 'production'
                        ? 'Servidor produção'
                        : 'Servidor local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['src/routes/**/*.ts', 'dist/routes/**/*.js']
})
