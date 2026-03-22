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
const userController = __importStar(require("../controllers/user-controller"));
const favoriteController = __importStar(require("../controllers/favorites-controller"));
const auth_1 = require("../middleware/auth");
const rate_limit_1 = require("../infra/rate-limit");
exports.router = (0, express_1.Router)();
exports.router.get('/', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, userController.profile);
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
exports.router.post('/addresses', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, userController.addAddress);
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
exports.router.get('/addresses', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, userController.getAddresses);
exports.router.delete('/addresses/:id', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, userController.deleteAddress);
exports.router.put('/addresses/:id', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, userController.updateAddress);
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
exports.router.post('/favorites', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, favoriteController.postFavorite);
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
exports.router.get('/favorites', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, favoriteController.getListFavorites);
exports.router.delete('/favorites/:productId', auth_1.authMiddleware, rate_limit_1.authenticatedRateLimit, favoriteController.deleteFavorite);
exports.default = exports.router;
