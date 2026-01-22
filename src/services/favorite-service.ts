import { prisma } from "../libs/prisma";


export const favoritesService = async (userId: number, productId: number) => {
    const favorite = await prisma.favorites.findUnique({
        where: {
            userId_productId: { userId, productId },
        },

    });

    if (favorite) {
        await prisma.favorites.delete({ where: { id: favorite.id } });
        return { favorited: false };
    }

    await prisma.favorites.create({
        data: { userId, productId },
    });

    return { favorited: true };
}

export const listfavoritesByUserService = async (userId: number) => {
    const favorites = await prisma.favorites.findMany({
        where: { userId },
        include: { product: true },
    });

    return favorites.map(f => f.product);
}
