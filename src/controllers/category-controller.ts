import { getCategoryBySlugService, getCategoryMetadataService } from "@/services/category-service";
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";
import { RequestHandler } from "express";

export const getCategoryWithMetadata: RequestHandler = async (req, res) => {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    const category = await getCategoryBySlugService(slug);
    if (!category) {
        throw new AppError(
            "Categoria não encontrada",
            "CATEGORY_NOT_FOUND",
            HttpStatus.NOT_FOUND
        )

    }

    const metadata = await getCategoryMetadataService(category.id);


    return res.status(HttpStatus.OK).json({
        success: true,
        data: { category, metadata }
    });

}