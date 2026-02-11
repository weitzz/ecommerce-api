import { prisma } from "@/libs/prisma";
import { toggleFavoriteService, listFavoritesByUserService, removeFavoriteService } from "@/services/favorite-service";
jest.mock("@/libs/prisma", () => ({
    prisma: {
        favorites: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
        },
        product: {
            findUniqueOrThrow: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

describe("toggleFavoriteService", () => {
    const userId = 123;
    const productId = 456;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve remover favorito se já existir", async () => {
        (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
            cb({
                favorites: {
                    findUnique: jest.fn().mockResolvedValue({ userId, productId }),
                    delete: jest.fn(),
                    create: jest.fn(),
                },
                product: {
                    findUniqueOrThrow: jest.fn(),
                },
            })
        );

        const result = await toggleFavoriteService(userId, productId);

        expect(result).toEqual({
            favorited: false,
            productId,
        });
    });

    it("deve favoritar produto se ainda não existir", async () => {
        (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
            cb({
                favorites: {
                    findUnique: jest.fn().mockResolvedValue(null),
                    delete: jest.fn(),
                    create: jest.fn(),
                },
                product: {
                    findUniqueOrThrow: jest.fn().mockResolvedValue({ id: productId }),
                },
            })
        );
        const result = await toggleFavoriteService(userId, productId);

        expect(result).toEqual({
            favorited: true,
            productId,
        });
    });

})

describe("listFavoritesByUserService", () => {
    it("deve listar favoritos do usuário", async () => {
        const mockFavorites = [
            { product: { id: 1, name: "Produto A", price: 123, liked: true, images: [{ imageUrl: "teste.png" }], } },
            { product: { id: 2, name: "Produto B", price: 123, liked: true, images: [{ imageUrl: "teste.png" }], } },
        ];
        (prisma.favorites.findMany as jest.Mock).mockResolvedValue(mockFavorites);

        const result = await listFavoritesByUserService(1);

        expect(prisma.favorites.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId: 1 },
                orderBy: { createdAt: "desc" },
            })
        );

        expect(result).toEqual([
            { id: 1, name: "Produto A", price: 123, liked: true, image: "media/products/teste.png", },
            { id: 2, name: "Produto B", price: 123, liked: true, image: "media/products/teste.png", },
        ]);
    });


});

describe("removeFavoriteService", () => {
    const userId = 1;
    const productId = 10;

    it("deve remover favorito existente", async () => {
        (prisma.favorites.findUnique as jest.Mock).mockResolvedValue({
            userId,
            productId,
        });

        (prisma.favorites.delete as jest.Mock).mockResolvedValue({
            userId,
            productId,
        });

        const result = await removeFavoriteService(userId, productId);

        expect(prisma.favorites.delete).toHaveBeenCalledWith({
            where: {
                userId_productId: { userId, productId },
            },
        });

        expect(result).toEqual({ removed: true });
    });

    it("deve retornar removed false se favorito não existir", async () => {
        (prisma.favorites.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await removeFavoriteService(userId, productId);

        expect(result).toEqual({ removed: false });
    });
});