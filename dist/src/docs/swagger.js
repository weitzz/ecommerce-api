"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const get_base_url_1 = require("../utils/get-base-url");
const isProduction = process.env.NODE_ENV === 'production';
exports.swaggerConfig = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'Documentação da API',
        },
        servers: [{ url: (0, get_base_url_1.getBaseUrl)() }],
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
    apis: [path_1.default.join(process.cwd(), isProduction ? 'dist/src/routes/**/*.js' : 'src/routes/**/*.ts'),]
});
