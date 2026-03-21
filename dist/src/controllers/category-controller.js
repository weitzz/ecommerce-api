"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryWithMetadata = void 0;
const category_service_1 = require("../services/category-service");
const app_error_1 = require("../shared/errors/app-error");
const status_codes_1 = require("../shared/http/status-codes");
const getCategoryWithMetadata = async (req, res) => {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const category = await (0, category_service_1.getCategoryBySlugService)(slug);
    if (!category) {
        throw new app_error_1.AppError("Categoria não encontrada", "CATEGORY_NOT_FOUND", status_codes_1.HttpStatus.NOT_FOUND);
    }
    const metadata = await (0, category_service_1.getCategoryMetadataService)(category.id);
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: { category, metadata }
    });
};
exports.getCategoryWithMetadata = getCategoryWithMetadata;
