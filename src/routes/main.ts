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


/* ===== PUBLIC ===== */
routes.get('/banners', bannerController.getBanners);
routes.get('/products', productsController.getProducts);
routes.get('/products/:id', productsController.getProductById);
routes.get('/products/:id/related', productsController.getRelatedProducts);
routes.get('/categories/:slug/metadata', categoryController.getCategoryWithMetadata);

routes.post('/auth/register', userController.registerUser);
routes.post('/auth/login', userController.loginUser);

routes.post('/cart/mount', cartController.cartMont);
routes.get('/cart/shipping', cartController.calculateShipping);

/* ===== PROTECTED ===== */
routes.post('/cart/finish', authMiddleware, cartController.finish);

routes.post('/me/addresses', authMiddleware, userController.addAddress);
routes.get('/me/addresses', authMiddleware, userController.getAddresses);

routes.post('/me/favorites', authMiddleware, favoriteController.postFavoriteController);
routes.get('/me/favorites', authMiddleware, favoriteController.getListFavoritesController);

routes.get('/orders', authMiddleware, orderController.getOrders);
routes.get('/orders/:id', authMiddleware, orderController.getOrderById);

/* ===== WEBHOOK ===== */
routes.post('/webhook/stripe', webhookController.stripe);

/* ===== OPTIONAL ===== */
routes.get('/orders/session', orderController.getOrderBySessionId);