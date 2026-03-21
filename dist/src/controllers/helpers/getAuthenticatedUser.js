"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = getAuthenticatedUser;
const app_error_1 = require("../../shared/errors/app-error");
const status_codes_1 = require("../../shared/http/status-codes");
function getAuthenticatedUser(req) {
    const user = req.user;
    if (!user) {
        throw new app_error_1.AppError("Acesso negado", "UNAUTHORIZED", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    return user;
}
