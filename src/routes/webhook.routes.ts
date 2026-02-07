import { Router } from "express";
import * as webhookController from "@/controllers/webhook-controller"

export const router = Router();


/**
 * @openapi
 * /webhook/stripe:
 *   post:
 *     tags:
 *       - Webhook
 *     summary: Webhook do Stripe
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Evento processado
 */
router.post('/stripe', webhookController.stripe);


export default router