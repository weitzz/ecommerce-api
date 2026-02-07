import { Router } from "express";
import * as productsController from "@/controllers/products-controller";

export const router = Router();




/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lista produtos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/', productsController.getProducts);
/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Busca produto por ID
 *     parameters:
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', productsController.getProductById);
/**
 * @openapi
 * /products/{id}/related:
 *   get:
 *     tags: [Products]
 *     summary: Lista produtos relacionados
 *     parameters:
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produtos relacionados
 */

router.get('/:id/related', productsController.getRelatedProducts);


export default router