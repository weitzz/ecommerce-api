"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIdParam = parseIdParam;
const app_error_1 = require("../../shared/errors/app-error");
const status_codes_1 = require("../../shared/http/status-codes");
function parseIdParam(param, name = "ID") {
    if (!param) {
        throw new app_error_1.AppError(`${name} inválido`, "INVALID_PARAM", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    if (Array.isArray(param)) {
        throw new app_error_1.AppError(`${name} inválido`, "INVALID_PARAM", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    const id = Number(param);
    if (Number.isNaN(id)) {
        throw new app_error_1.AppError(`${name} inválido`, "INVALID_PARAM", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    return id;
}
