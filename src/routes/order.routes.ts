import { Router } from "express";
import * as orderController from "@/controllers/order-controller"
import { authMiddleware } from "@/middleware/auth";
import { authenticatedRateLimit } from "@/infra/rate-limit"
export const router = Router();




/**
 * @openapi
 * /orders/session:
 *   get:
 *     tags: [Orders]
 *     summary: Busca pedido por sessão
 *     responses:
 *       200:
 *         description: Pedido encontrado
 */
router.get('/session', orderController.getOrderBySessionId);


/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Lista pedidos do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/', authMiddleware, authenticatedRateLimit, orderController.getOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Busca pedido por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', authMiddleware, authenticatedRateLimit, orderController.getOrderById);



export default router