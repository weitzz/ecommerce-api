import { Product } from "@/types/product";
import { prisma } from "../libs/prisma";


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

export const listFavoritesByUserService = async (userId: number): Promise<Product[]> => {
    const favorites = await prisma.favorites.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            product: true
        }
    });

    return favorites.map(f => f.product);
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