import { RequestHandler } from "express";
import { favoritesService, listfavoritesByUserService } from '@/services/favorite-service'
import { FavoriteSchema } from "@/schemas/favorite-schema";


export const postFavoriteController: RequestHandler = async (req, res) => {
    const userId = (req as any).userId
    const result = FavoriteSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({ error: result.error })
    }

    const favorite = await favoritesService(userId, result.data.productId)

    return res.json(favorite)
}

export const getListFavoritesController: RequestHandler = async (req, res) => {
    const userId = (req as any).userId
    const favorites = await listfavoritesByUserService(userId);

    return res.json(favorites);
} 