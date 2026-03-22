import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import { getBaseUrl } from '@/utils/get-base-url'

const isProduction = process.env.NODE_ENV === 'production'

export const swaggerConfig = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'Documentação da API',
        },
        servers: [{ url: getBaseUrl() }],
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
    apis: [path.join(
        process.cwd(),
        isProduction ? 'dist/src/routes/**/*.js' : 'src/routes/**/*.ts'
    ),]
})
