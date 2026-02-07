import { Product } from "@/types/product";
import { prisma } from "../libs/prisma";
import { FavoriteProduct } from "@/types/favorite-product";


export const toggleFavoriteService = async (
    userId: number,
    productId: number
) => {
    const result = await prisma.$transaction(async (tx) => {
        const favorite = await tx.favorites.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });

        if (favorite) {
            await tx.favorites.delete({
                where: {
                    userId_productId: { userId, productId },
                },
            });

            return { favorited: false };
        }

        await tx.product.findUniqueOrThrow({
            where: { id: productId },
        });

        await tx.favorites.create({
            data: { userId, productId },
        });

        return { favorited: true };
    });

    return {
        ...result,
        productId,
    };
};

export const listFavoritesByUserService = async (userId: number): Promise<FavoriteProduct[]> => {
    const favorites = await prisma.favorites.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            product: {
                include: {
                    images: {
                        take: 1,
                        orderBy: { createdAt: 'asc' }
                    }
                }
            }
        }
    });

    return favorites.map(favorite => {
        const product = favorite.product
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]
                ? `media/products/${product.images[0].imageUrl}`
                : null,
            liked: true
        }
    });
}

export const removeFavoriteService = async (userId: number, productId: number) => {
    const favorite = await prisma.favorites.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
    });

    if (!favorite) {
        return { removed: false };
    }

    await prisma.favorites.delete({
        where: {
            userId_productId: { userId, productId },
        },
    });

    return { removed: true };

}