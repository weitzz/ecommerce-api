import { getCategoryBySlugService, getCategoryMetadataService } from "@/services/category-service";
import { RequestHandler } from "express";

export const getCategoryWithMetadata: RequestHandler = async (req, res) => {
    const { slug } = req.params;

    const category = await getCategoryBySlugService(slug);
    if (!category) {
        return res.status(404).json({ error: 'Category not found' });

    }

    const metadata = await getCategoryMetadataService(category.id);

    res.json({ error: null, category, metadata });

}