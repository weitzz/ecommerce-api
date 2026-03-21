"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavoriteService = exports.listFavoritesByUserService = exports.toggleFavoriteService = void 0;
const prisma_1 = require("../libs/prisma");
const toggleFavoriteService = async (userId, productId) => {
    const result = await prisma_1.prisma.$transaction(async (tx) => {
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
exports.toggleFavoriteService = toggleFavoriteService;
const listFavoritesByUserService = async (userId) => {
    const favorites = await prisma_1.prisma.favorites.findMany({
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
        const product = favorite.product;
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]
                ? `media/products/${product.images[0].imageUrl}`
                : null,
            liked: true
        };
    });
};
exports.listFavoritesByUserService = listFavoritesByUserService;
const removeFavoriteService = async (userId, productId) => {
    const favorite = await prisma_1.prisma.favorites.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
    });
    if (!favorite) {
        return { removed: false };
    }
    await prisma_1.prisma.favorites.delete({
        where: {
            userId_productId: { userId, productId },
        },
    });
    return { removed: true };
};
exports.removeFavoriteService = removeFavoriteService;
