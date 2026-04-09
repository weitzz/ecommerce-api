"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finish = exports.calculateShipping = exports.cartMont = void 0;
const cart_mount_schema_1 = require("../schemas/cart-mount-schema");
const products_service_1 = require("../services/products-service");
const get_absolute_image_url_1 = require("../utils/get-absolute-image-url");
const calculate_shipping_schema_1 = require("../schemas/calculate-shipping-schema");
const cart_finish_schema_1 = require("../schemas/cart-finish-schema");
const user_service_1 = require("../services/user-service");
const order_service_1 = require("../services/order-service");
const payment_service_1 = require("../services/payment-service");
const status_codes_1 = require("../shared/http/status-codes");
const app_error_1 = require("../shared/errors/app-error");
const cartMont = async (req, res) => {
    const result = cart_mount_schema_1.cartMountSchema.safeParse(req.body);
    if (!result.success) {
        throw new app_error_1.AppError("Dados inválidos no corpo da requisição", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    const products = await Promise.all(result.data.ids.map(async (id) => {
        const product = await (0, products_service_1.getProductByIdService)(id);
        if (!product)
            return null;
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]
                ? (0, get_absolute_image_url_1.getAbsoluteImageUrl)(product.images[0])
                : null,
        };
    }));
    return res.status(status_codes_1.HttpStatus.OK).json({ success: true, data: products.filter(Boolean) });
};
exports.cartMont = cartMont;
const calculateShipping = async (req, res) => {
    const result = calculate_shipping_schema_1.calculateShippingSchema.safeParse(req.query);
    if (!result.success) {
        throw new app_error_1.AppError("CEP inválido", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: {
            zipcode: result.data.zipcode,
            shippingCost: 7,
            shippingDays: 3
        }
    });
};
exports.calculateShipping = calculateShipping;
const finish = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new app_error_1.AppError("Acesso negado", "UNAUTHORIZED", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    const result = cart_finish_schema_1.cartFinishSchema.safeParse(req.body);
    if (!result.success) {
        throw new app_error_1.AppError("Carrinho inválido", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    const { cart, addressId } = result.data;
    const address = await (0, user_service_1.getAddressByIdService)(userId, addressId);
    if (!address) {
        throw new app_error_1.AppError("Endereço inválido", "ADDRESS_NOT_FOUND", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    const orderId = await (0, order_service_1.createOrderService)({
        userId,
        cart,
        address,
        shippingCost: 7,
        shippingDays: 3
    });
    if (!orderId) {
        throw new app_error_1.AppError("Falha ao criar pedido", "ORDER_CREATION_FAILED", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    const url = await (0, payment_service_1.createPaymentLinkService)({
        cart,
        shippingCost: 7,
        orderId
    });
    if (!url) {
        throw new app_error_1.AppError("Falha ao criar link de pagamento", "PAYMENT_LINK_FAILED", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    return res.status(status_codes_1.HttpStatus.CREATED).json({
        success: true,
        url,
        checkoutUrl: url,
        data: {
            url,
            checkoutUrl: url
        }
    });
};
exports.finish = finish;
