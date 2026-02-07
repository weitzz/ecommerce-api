import { Router } from "express";
import * as categoryController from "@/controllers/category-controller";

export const router = Router();


router.get('/:slug/metadata', categoryController.getCategoryWithMetadata);


export default router