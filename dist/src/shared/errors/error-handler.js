"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const app_error_1 = require("./app-error");
function errorHandler(err, req, res, next) {
    if (err instanceof app_error_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                code: err.code,
                details: err.details,
            },
        });
    }
    return res.status(500).json({
        success: false,
        error: {
            message: "Erro interno do servidor",
            code: "INTERNAL_SERVER_ERROR",
        },
    });
}
