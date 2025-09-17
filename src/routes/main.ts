import { Router } from "express";
import * as bannerController from "@/controllers/banner-controller.js";
import * as productsController from "@/controllers/products-controller.js";
import * as categoryController from "@/controllers/category-controller.js";
import * as cartController from "@/controllers/cart-controller.js";
import * as userController from "@/controllers/user-controller.js"
export const routes = Router();


routes.get('/ping', (req, res) => {
    res.json({ pong: true });
})

routes.get('/banners', bannerController.getBanners);
routes.get('/products', productsController.getProducts);
routes.get('/product/:id', productsController.getProductById);
routes.get('/product/:id/related', productsController.getRelatedProducts);
routes.get('category/:slug/metadata', categoryController.getCategoryWithMetadata);
routes.post('/cart/mount', cartController.cartMont);
routes.get('/cart/shipping', cartController.calculateShipping);
routes.post('/user/register', userController.registerUser);