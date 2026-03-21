"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = validateSchema;
const app_error_1 = require("../../shared/errors/app-error");
const status_codes_1 = require("../../shared/http/status-codes");
function validateSchema(schema, data, message = "Dados inválidos") {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new app_error_1.AppError(message, "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    return result.data;
}
