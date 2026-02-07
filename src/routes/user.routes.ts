import { Router } from "express";

import * as userController from "@/controllers/user-controller"
import * as favoriteController from "@/controllers/favorites-controller"
import { authMiddleware } from "@/middleware/auth";
import { authenticatedRateLimit } from "@/infra/rate-limit"
export const router = Router();


//limpeza automática de refresh tokens => fazer


router.get('/', authMiddleware, authenticatedRateLimit, userController.profile)
/**
 * @openapi
 * /me/addresses:
 *   post:
 *     tags: [User]
 *     summary: Adiciona endereço
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - number
 *               - city
 *               - state
 *               - zipcode
 *             properties:
 *               street:
 *                 type: string
 *                 example: Rua das Flores
 *               number:
 *                 type: string
 *                 example: "123"
 *               complement:
 *                 type: string
 *                 example: Apto 45
 *               city:
 *                 type: string
 *                 example: São Paulo
 *               state:
 *                 type: string
 *                 example: SP
 *               zipcode:
 *                 type: string
 *                 example: 01000-000
 *               country:
 *                 type: string
 *                 example: Brasil
 *     responses:
 *       201:
 *         description: Endereço adicionado
 */
router.post('/addresses', authMiddleware, authenticatedRateLimit, userController.addAddress);
/**
 * @openapi
 * /me/addresses:
 *   get:
 *     tags:
 *       - User
 *     summary: Lista endereços do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de endereços
 */
router.get('/addresses', authMiddleware, authenticatedRateLimit, userController.getAddresses);

router.delete('/addresses/:id', authMiddleware, authenticatedRateLimit, userController.deleteAddress);
router.put('/addresses/:id', authMiddleware, authenticatedRateLimit, userController.updateAddress);
/**
 * @openapi
 * /me/favorites:
 *   post:
 *     tags: [Favorites]
 *     summary: Adiciona favorito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Favorito adicionado
 */

router.post('/favorites', authMiddleware, authenticatedRateLimit, favoriteController.postFavorite);
/**
 * @openapi
 * /me/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Lista favoritos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos
 */

router.get('/favorites', authMiddleware, authenticatedRateLimit, favoriteController.getListFavorites);

router.delete('/favorites/:productId', authMiddleware, authenticatedRateLimit, favoriteController.deleteFavorite)


export default router