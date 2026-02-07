import { Router } from "express";
import * as bannerController from "@/controllers/banner-controller";
export const router = Router();

/** * @openapi
 * /banners:
 *   get:
 *     tags:
 *       - Banners
 *     summary: Lista banners
 *     responses:
 *       200:
 *         description: Lista de banners
 */
router.get('/', bannerController.getBanners);


export default router