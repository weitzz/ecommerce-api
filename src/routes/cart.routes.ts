
import { Router } from "express";
import * as cartController from "@/controllers/cart-controller";
import { authMiddleware } from "@/middleware/auth";
import { authenticatedRateLimit } from "@/infra/rate-limit"
export const router = Router();


/**
 * @openapi
 * /cart/mount:
 *   post:
 *     tags: [Cart]
 *     summary: Monta carrinho
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Carrinho montado
 */

router.post('/mount', cartController.cartMont);
/**
 * @openapi
 * /cart/shipping:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Calcula frete
 *     parameters:
 *       - in: query
 *         name: zipcode
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345678"
 *     responses:
 *       200:
 *         description: Valor do frete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     zipcode:
 *                       type: string
 *                     shippingCost:
 *                       type: number
 *                     shippingDays:
 *                       type: number
 */
router.get('/shipping', cartController.calculateShipping);

/**
 * @openapi
 * /cart/finish:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Finaliza o carrinho
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pedido finalizado
 *       401:
 *         description: Não autorizado
 */
router.post('/finish', authMiddleware, authenticatedRateLimit, cartController.finish);



export default router