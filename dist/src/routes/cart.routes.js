"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const cartController = __importStar(require("../controllers/cart-controller"));
const auth_1 = require("../middleware/auth");
const rate_limit_1 = require("../infra/rate-limit");
exports.router = (0, express_1.Router)();
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
exports.router.post('/mount', cartController.cartMont);
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
exports.router.get('/shipping', cartController.calculateShipping);
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
exports.router.post('/finish', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, cartController.finish);
exports.default = exports.router;
