"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavorite = exports.getListFavorites = exports.postFavorite = void 0;
const favorite_service_1 = require("../services/favorite-service");
const favorite_schema_1 = require("../schemas/favorite-schema");
const app_error_1 = require("../shared/errors/app-error");
const status_codes_1 = require("../shared/http/status-codes");
const postFavorite = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new app_error_1.AppError("Acesso negado", "UNAUTHORIZED", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    const result = favorite_schema_1.FavoriteSchema.safeParse(req.body);
    if (!result.success) {
        throw new app_error_1.AppError("Dados inválidos no corpo da requisição", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    const favorite = await (0, favorite_service_1.toggleFavoriteService)(userId, result.data.productId);
    return res.status(favorite.favorited ? status_codes_1.HttpStatus.CREATED : status_codes_1.HttpStatus.OK).json({
        success: true,
        data: favorite
    });
};
exports.postFavorite = postFavorite;
const getListFavorites = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new app_error_1.AppError("Acesso negado", "UNAUTHORIZED", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    const favorites = await (0, favorite_service_1.listFavoritesByUserService)(userId);
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: favorites
    });
};
exports.getListFavorites = getListFavorites;
const deleteFavorite = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new app_error_1.AppError("Acesso negado", "UNAUTHORIZED", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    const result = favorite_schema_1.FavoriteParamsSchema.safeParse(req.params);
    if (!result.success) {
        throw new app_error_1.AppError("Parâmetros inválidos", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    const { productId } = result.data;
    const removed = await (0, favorite_service_1.removeFavoriteService)(userId, productId);
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: removed,
    });
};
exports.deleteFavorite = deleteFavorite;
