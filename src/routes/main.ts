import { Router } from "express";
import * as bannerController from "../controllers/banner-controller.js";
import * as productsController from "../controllers/products-controller.js";
import * as categoryController from "../controllers/category-controller.js";
export const routes = Router();

routes.get('/banners', bannerController.getBanners);
routes.get('/products', productsController.getProducts);
routes.get('/product/:id', productsController.getProductById);
routes.get('/product/:id/related', productsController.getRelatedProducts);
routes.get('category/:slug/metadata', categoryController.getCategoryWithMetadata);
