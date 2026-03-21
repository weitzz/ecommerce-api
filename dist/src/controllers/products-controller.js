"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedProducts = exports.getProductById = exports.getProducts = void 0;
const get_product_by_id_schema_1 = require("../schemas/get-product-by-id-schema");
const get_product_schema_1 = require("../schemas/get-product-schema");
const products_service_1 = require("../services/products-service");
const get_absolute_image_url_1 = require("../utils/get-absolute-image-url");
const category_service_1 = require("../services/category-service");
const get_product_query_schema_1 = require("../schemas/get-product-query-schema");
const app_error_1 = require("../shared/errors/app-error");
const status_codes_1 = require("../shared/http/status-codes");
const getProducts = async (req, res) => {
    const parseResult = get_product_schema_1.getProductSchema.safeParse(req.query);
    if (!parseResult.success) {
        throw new app_error_1.AppError("Parâmetros de consulta inválidos", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, parseResult.error.flatten());
    }
    const { metadata, orderBy, order, limit, page, search } = parseResult.data;
    let parsedMetadata;
    try {
        parsedMetadata = metadata ? JSON.parse(metadata) : undefined;
    }
    catch {
        throw new app_error_1.AppError("Formato de metadados inválido", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    const result = await (0, products_service_1.getAllProductsService)({
        metadata: parsedMetadata,
        orderBy,
        order,
        limit,
        page,
        search
    });
    const data = result.data.map(product => ({
        ...product,
        image: product.image ? (0, get_absolute_image_url_1.getAbsoluteImageUrl)(product.image) : null,
        liked: false
    }));
    return res.status(status_codes_1.HttpStatus.OK).json({ success: true, data, meta: result.meta });
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const productId = get_product_by_id_schema_1.getProductByIdSchema.safeParse(req.params);
    if (!productId.success) {
        throw new app_error_1.AppError("ID do produto inválido", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, productId.error.flatten());
    }
    const { id } = productId.data;
    const product = await (0, products_service_1.getProductByIdService)(Number(id));
    if (!product) {
        throw new app_error_1.AppError("Produto não encontrado", "PRODUCT_NOT_FOUND", status_codes_1.HttpStatus.NOT_FOUND);
    }
    const productWithAbsoluteImages = {
        ...product,
        images: product.images.map(image => (0, get_absolute_image_url_1.getAbsoluteImageUrl)(image)),
    };
    await (0, products_service_1.incrementProductViewsService)(product.id);
    const category = await (0, category_service_1.getCategoryService)(product.categoryId);
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: {
            product: productWithAbsoluteImages,
            category
        }
    });
};
exports.getProductById = getProductById;
const getRelatedProducts = async (req, res) => {
    const productId = get_product_by_id_schema_1.getProductByIdSchema.safeParse(req.params);
    const queryResult = get_product_query_schema_1.getProductsQuerySchema.safeParse(req.query);
    if (!productId.success || !queryResult.success) {
        throw new app_error_1.AppError("ID do produto ou parâmetros de consulta inválidos", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, {
            ...(!productId.success ? { params: productId.error.flatten() } : {}),
            ...(!queryResult.success ? { query: queryResult.error.flatten() } : {}),
        });
    }
    const { id } = productId.data;
    const { limit } = queryResult.data;
    const products = await (0, products_service_1.getProductsFromSameCategoryService)(parseInt(id), limit ? parseInt(limit) : undefined);
    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: product.image ? (0, get_absolute_image_url_1.getAbsoluteImageUrl)(product.image) : null,
        liked: false
    }));
    return res.status(status_codes_1.HttpStatus.OK).json({ success: true, data: productsWithAbsoluteUrl });
};
exports.getRelatedProducts = getRelatedProducts;
