import { RequestHandler } from "express";
import { toggleFavoriteService, listFavoritesByUserService, removeFavoriteService } from '@/services/favorite-service'
import { FavoriteSchema, FavoriteParamsSchema } from "@/schemas/favorite-schema";
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";

export const postFavorite: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(
            "Acesso negado",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )
    }

    const result = FavoriteSchema.safeParse(req.body)

    if (!result.success) {
        throw new AppError(
            "Dados inválidos no corpo da requisição",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        )
    }

    const favorite = await toggleFavoriteService(userId, result.data.productId)



    return res.status(favorite.favorited ? HttpStatus.CREATED : HttpStatus.OK).json({
        success: true,
        data: favorite
    });
}

export const getListFavorites: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(
            "Acesso negado",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )
    }

    const favorites = await listFavoritesByUserService(userId);

    return res.status(HttpStatus.OK).json({
        success: true,
        data: favorites
    });
}


export const deleteFavorite: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError(
            "Acesso negado",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        );
    }

    const result = FavoriteParamsSchema.safeParse(req.params);
    if (!result.success) {
        throw new AppError(
            "Parâmetros inválidos",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        );
    }

    const { productId } = result.data;

    const removed = await removeFavoriteService(userId, productId);

    return res.status(HttpStatus.OK).json({
        success: true,
        data: removed,
    });
};
