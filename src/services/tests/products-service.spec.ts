import { prisma } from "@/libs/prisma";
import {
    getAllProductsService,
    getProductByIdService,
    incrementProductViewsService,
    getProductsFromSameCategoryService,
} from "@/services/products-service";

jest.mock("@/libs/prisma", () => ({
    prisma: {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            count: jest.fn(),
            updateMany: jest.fn(),
        },
    },
}));

describe("Product Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe("getAllProductsService", () => {
        it("deve paginar corretamente", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: 1, name: "Produto", price: 50, images: [{ imageUrl: "img.png" }] },
            ]);

            (prisma.product.count as jest.Mock).mockResolvedValue(20);

            const result = await getAllProductsService({ page: 2, limit: 10 });

            expect(prisma.product.findMany as jest.Mock).toHaveBeenCalledWith(
                expect.objectContaining({
                    skip: 10,
                    take: 10,
                })
            );

            expect(result.meta).toEqual({
                page: 2,
                limit: 10,
                total: 20,
                totalPages: 2,
            });
        });
        it("deve ordenar por preço desc", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.product.count as jest.Mock).mockResolvedValue(0);

            await getAllProductsService({ orderBy: "price", order: "desc" });

            expect(prisma.product.findMany as jest.Mock).toHaveBeenCalledWith(
                expect.objectContaining({
                    orderBy: { price: "desc" },
                })
            );
        });


        it("deve aplicar filtro de metadata", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.product.count as jest.Mock).mockResolvedValue(0);

            await getAllProductsService({
                metadata: { size: ["p", "m"] },
            });

            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        AND: [
                            {
                                metadata: {
                                    some: {
                                        categoryMetadataId: "size",
                                        metadataValueId: { in: ["p", "m"] },
                                    },
                                },
                            },
                        ],
                    },
                })
            );
        });


        it("deve aplicar busca", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.product.count as jest.Mock).mockResolvedValue(0);

            await getAllProductsService({ search: "camisa" });

            expect(prisma.product.findMany as jest.Mock).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        AND: [
                            {
                                OR: [
                                    { name: expect.any(Object) },
                                    { description: expect.any(Object) },
                                ],
                            },
                        ],
                    },
                })
            );
        });

    });



    describe("getProductByIdService", () => {
        it("deve retornar produto com images formatado", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                name: "Produto Teste",
                description: "Desc",
                price: 100,
                categoryId: 1,
                images: [{ imageUrl: "img1.png" }, { imageUrl: "img2.png" }],
            });

            const result = await getProductByIdService(1);

            expect(result.images).toEqual(["/media/products/img1.png", "/media/products/img2.png"]);
        });

        it("deve retornar null se produto não existir", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await getProductByIdService(999);

            expect(result).toBeNull();
        });

        it("deve retornar images vazia se não houver imagens", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                name: "Produto Teste",
                description: "Desc",
                price: 100,
                categoryId: 2,
                images: [],
            });

            const result = await getProductByIdService(1);

            expect(result.images).toEqual([]);
        });
    });


    describe("incrementProductViewsService", () => {
        it("deve chamar prisma.update para incrementar views", async () => {
            (prisma.product.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

            await incrementProductViewsService(1);

            expect(prisma.product.updateMany).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { viewsCount: { increment: 1 } },
            });
        });
    });


    describe("getProductsFromSameCategoryService", () => {
        it("deve retornar produtos da mesma categoria ", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({ categoryId: 10 });
            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: 2, name: "Produto 2", price: 50, images: [{ imageUrl: "product_1_1.png" }] },
            ]);

            const result = await getProductsFromSameCategoryService(1);

            expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, select: { categoryId: true } });
            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { categoryId: 10, id: { not: 1 } },
                    take: 4,
                    orderBy: { viewsCount: "desc" },
                })
            );
            expect(result[0].image).toBe("/media/products/product_1_1.png");
        });

        it("deve retornar array vazio se produto não existir", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await getProductsFromSameCategoryService(999);

            expect(result).toEqual([]);
        });

        it("deve retornar image=null se produto não tiver imagens", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({ categoryId: 10 });
            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: 2, name: "Produto 2", price: 50, images: [] },
            ]);

            const result = await getProductsFromSameCategoryService(1);

            expect(result[0].image).toBeNull();
        });
    });
});
