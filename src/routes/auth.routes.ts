import { Router } from "express";
import * as userController from "@/controllers/user-controller"
import { refreshTokenController } from "@/controllers/auth/refresh-token-controller";
import { logoutController } from "@/controllers/auth/logout-controller";
import { loginRateLimit, refreshRateLimit, logoutRateLimit } from "@/infra/rate-limit"
export const router = Router();


router.post("/refresh", refreshRateLimit, refreshTokenController)
router.post("/logout", logoutRateLimit, logoutController)
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registro de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário registrado
 */
router.post('/register', userController.registerUser);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginRateLimit, userController.loginUser);


export default router