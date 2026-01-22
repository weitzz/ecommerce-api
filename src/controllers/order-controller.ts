import { getOrderBySessionIdSchema } from "@/schemas/get-by-session-order-id-schema";
import { getOrderByIdSchema } from "@/schemas/get-order-schema";
import { getOrderByIdService, getUserOrdersService } from "@/services/order-service";
import { getOrderIdFromSessionService } from "@/services/payment-service";
import { RequestHandler } from "express";


export const getOrderBySessionId: RequestHandler = async (req, res) => {
    const result = getOrderBySessionIdSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ error: "Session ID invalid" });
    }

    const { session_id } = result.data;

    const orderId = await getOrderIdFromSessionService(session_id);
    if (!orderId) {
        return res.status(404).json({ error: "Order not found" });
    }

    res.json({ error: null, orderId })
}


export const getOrders: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).json({ error: "Access denied" });

    }

    const orders = await getUserOrdersService(userId)


    res.json({ error: null, orders })
}


export const getOrderById: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).json({ error: "Access denied" });
    }
    const result = getOrderByIdSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({ error: "ID invalid" });
    }

    const { id } = result.data;

    const order = await getOrderByIdService(parseInt(id), userId);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }


    res.json({
        error: null,
        order
    })
}