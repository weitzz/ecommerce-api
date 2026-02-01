import { getOrderBySessionIdSchema } from "@/schemas/get-by-session-order-id-schema";
import { getOrderByIdSchema } from "@/schemas/get-order-schema";
import { getOrderByIdService, getUserOrdersService } from "@/services/order-service";
import { getOrderIdFromSessionService } from "@/services/payment-service";
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";
import { RequestHandler } from "express";


export const getOrderBySessionId: RequestHandler = async (req, res) => {
    const result = getOrderBySessionIdSchema.safeParse(req.query);
    if (!result.success) {
        throw new AppError(
            "Sessão ID inválido",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        )
    }

    const { sessionId } = result.data;

    const orderId = await getOrderIdFromSessionService(sessionId);
    if (!orderId) {
        throw new AppError(
            "Pedido não encontrado",
            "ORDER_NOT_FOUND",
            HttpStatus.NOT_FOUND
        )
    }

    return res.status(HttpStatus.OK).json({ success: true, data: { orderId } })
}


export const getOrders: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(
            "Acesso negado",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )

    }

    const orders = await getUserOrdersService(userId)


    return res.status(HttpStatus.OK).json({ success: true, data: orders })
}


export const getOrderById: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(
            "Acesso negado",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )
    }
    const result = getOrderByIdSchema.safeParse(req.params);
    if (!result.success) {
        throw new AppError(
            "ID invalido",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        )
    }

    const { id } = result.data;

    const order = await getOrderByIdService(Number(id), userId);
    if (!order) {
        throw new AppError(
            "Pedido não encontrado",
            "ORDER_NOT_FOUND",
            HttpStatus.NOT_FOUND
        )
    }


    return res.status(HttpStatus.OK).json({
        success: true,
        data: order
    })
}