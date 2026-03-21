"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getOrders = exports.getOrderBySessionId = void 0;
const get_by_session_order_id_schema_1 = require("../schemas/get-by-session-order-id-schema");
const get_order_schema_1 = require("../schemas/get-order-schema");
const order_service_1 = require("../services/order-service");
const payment_service_1 = require("../services/payment-service");
const app_error_1 = require("../shared/errors/app-error");
const status_codes_1 = require("../shared/http/status-codes");
const getOrderBySessionId = async (req, res) => {
    const result = get_by_session_order_id_schema_1.getOrderBySessionIdSchema.safeParse(req.query);
    if (!result.success) {
        throw new app_error_1.AppError("Sessão ID inválido", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    const { sessionId } = result.data;
    const orderId = await (0, payment_service_1.getOrderIdFromSessionService)(sessionId);
    if (!orderId) {
        throw new app_error_1.AppError("Pedido não encontrado", "ORDER_NOT_FOUND", status_codes_1.HttpStatus.NOT_FOUND);
    }
    return res.status(status_codes_1.HttpStatus.OK).json({ success: true, data: { orderId } });
};
exports.getOrderBySessionId = getOrderBySessionId;
const getOrders = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new app_error_1.AppError("Acesso negado", "UNAUTHORIZED", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    const orders = await (0, order_service_1.getUserOrdersService)(userId);
    return res.status(status_codes_1.HttpStatus.OK).json({ success: true, data: orders });
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new app_error_1.AppError("Acesso negado", "UNAUTHORIZED", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    const result = get_order_schema_1.getOrderByIdSchema.safeParse(req.params);
    if (!result.success) {
        throw new app_error_1.AppError("ID invalido", "VALIDATION_ERROR", status_codes_1.HttpStatus.BAD_REQUEST, result.error.flatten());
    }
    const { id } = result.data;
    const order = await (0, order_service_1.getOrderByIdService)(Number(id), userId);
    if (!order) {
        throw new app_error_1.AppError("Pedido não encontrado", "ORDER_NOT_FOUND", status_codes_1.HttpStatus.NOT_FOUND);
    }
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: order
    });
};
exports.getOrderById = getOrderById;
