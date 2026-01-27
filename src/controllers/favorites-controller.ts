import { RequestHandler } from "express";
import { favoritesService, listfavoritesByUserService } from '@/services/favorite-service'
import { FavoriteSchema } from "@/schemas/favorite-schema";
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";

export const postFavoriteController: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(
            "Access denied",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )
    }

    const result = FavoriteSchema.safeParse(req.body)

    if (!result.success) {
        throw new AppError(
            "Invalid request body",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        )
    }

    const favorite = await favoritesService(userId, result.data.productId)

    return res.status(HttpStatus.CREATED).json({
        success: true,
        data: favorite
    });
}

export const getListFavoritesController: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(
            "Access denied",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )
    }

    const favorites = await listfavoritesByUserService(userId);

    return res.status(HttpStatus.OK).json({
        success: true,
        data: favorites
    });
}