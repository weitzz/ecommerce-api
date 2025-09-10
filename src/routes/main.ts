import { Router } from "express";
import * as bannerController from "../controllers/banner-controller.js";
export const routes = Router();

routes.get('/banners', bannerController.getBanners);
