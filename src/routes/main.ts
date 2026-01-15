import { Router } from "express";
import * as bannerController from "@/controllers/banner-controller";
import * as productsController from "@/controllers/products-controller";
import * as categoryController from "@/controllers/category-controller";
import * as cartController from "@/controllers/cart-controller";
import * as userController from "@/controllers/user-controller"
import * as webhookController from "@/controllers/webhook-controller"
import * as orderController from "@/controllers/order-controller"
import { authMiddleware } from "@/middleware/auth";
export const routes = Router();


routes.get('/ping', (req, res) => {
    res.json({ pong: true });
})

routes.get('/banners', bannerController.getBanners);
routes.get('/products', productsController.getProducts);
routes.get('/product/:id', productsController.getProductById);
routes.get('/product/:id/related', productsController.getRelatedProducts);
routes.get('/category/:slug/metadata', categoryController.getCategoryWithMetadata);

routes.post('/cart/mount', cartController.cartMont);
routes.get('/cart/shipping', cartController.calculateShipping);
routes.post('/cart/finish', authMiddleware, cartController.finish);

routes.post('/user/register', userController.registerUser);
routes.post('/user/login', userController.loginUser);
routes.post('/user/addresses', authMiddleware, userController.addAddress);
routes.get('/user/addresses', authMiddleware, userController.getAddresses);

routes.post('/webhook/stripe', webhookController.stripe);
routes.get('/orders/session', orderController.getOrderBySessionId)
routes.get('/orders', authMiddleware, orderController.getOrders)
routes.get('/orders/:id', authMiddleware, orderController.getOrderById)