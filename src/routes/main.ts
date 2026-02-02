import { Router } from "express";
import * as bannerController from "@/controllers/banner-controller";
import * as productsController from "@/controllers/products-controller";
import * as categoryController from "@/controllers/category-controller";
import * as cartController from "@/controllers/cart-controller";
import * as userController from "@/controllers/user-controller"
import * as webhookController from "@/controllers/webhook-controller"
import * as orderController from "@/controllers/order-controller"
import * as favoriteController from "@/controllers/favorites-controller"
import { authMiddleware } from "@/middleware/auth";
export const routes = Router();



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
routes.post('/auth/register', userController.registerUser);
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
routes.post('/auth/login', userController.loginUser);
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
routes.get('/products', productsController.getProducts);
/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Busca produto por ID
 *     parameters:
 *       - in: path
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
routes.get('/products/:id', productsController.getProductById);
/**
 * @openapi
 * /products/{id}/related:
 *   get:
 *     tags: [Products]
 *     summary: Lista produtos relacionados
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produtos relacionados
 */

routes.get('/products/:id/related', productsController.getRelatedProducts);
/**
 * @openapi
 * /categories/{slug}/metadata:
 *   get:
 *     tags: [Categories]
 *     summary: Metadados da categoria
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *          example: camisas
 *     responses:
 *       200:
 *         description: Metadados da categoria
 */
routes.get('/categories/:slug/metadata', categoryController.getCategoryWithMetadata);
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

routes.post('/cart/mount', cartController.cartMont);
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
routes.get('/cart/shipping', cartController.calculateShipping);

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
routes.post('/cart/finish', authMiddleware, cartController.finish);
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
routes.post('/me/addresses', authMiddleware, userController.addAddress);
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
routes.get('/me/addresses', authMiddleware, userController.getAddresses);
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

routes.post('/me/favorites', authMiddleware, favoriteController.postFavoriteController);
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

routes.get('/me/favorites', authMiddleware, favoriteController.getListFavoritesController);

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
routes.get('/orders', authMiddleware, orderController.getOrders);

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
routes.get('/orders/:id', authMiddleware, orderController.getOrderById);

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
routes.post('/webhook/stripe', webhookController.stripe);

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
routes.get('/orders/session', orderController.getOrderBySessionId);
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
routes.get('/banners', bannerController.getBanners);