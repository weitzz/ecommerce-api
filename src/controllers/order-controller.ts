import { getOrderBySessionIdSchema } from "@/schemas/get-by-session-order-id-schema";
import { getOrderIdFromSession } from "@/services/payment-service";
import { RequestHandler } from "express";

export const getOrderBySessionId: RequestHandler = async (req, res) => {
    const result = getOrderBySessionIdSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ error: "Session ID invalid" });
    }

    const { session_id } = result.data;

    const orderId = await getOrderIdFromSession(session_id);
    if (!orderId) {
        return res.status(404).json({ error: "Order not found" });
    }

    res.json({ error: null, orderId })
}