import { prisma } from "../../libs/prisma";
import {
    getAllProductsService,
    getProductByIdService,
    incrementProductViewsService,
    getProductsFromSameCategoryService,
} from "../products-service";

jest.mock("../../libs/prisma", () => ({
    prisma: {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

describe("Product Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe("getAllProductsService", () => {
        it("deve retornar produtos com image formatado", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: 1, name: "Produto 1", price: 50, images: [{ imageUrl: "img1.png" }] },
            ]);

            const result = await getAllProductsService({ order: "views", limit: 10 });

            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ orderBy: { viewsCount: "desc" }, take: 10 })
            );
            expect(result[0].image).toBe("media/products/img1.png");
            expect(result[0].images).toBeUndefined();
        });

        it("deve retornar produtos sem image se images vazio", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: 2, name: "Produto 2", price: 20, images: [] },
            ]);

            const result = await getAllProductsService({});

            expect(result[0].image).toBeNull();
        });

        it("deve aplicar filtros de metadata", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

            await getAllProductsService({ metadata: { "1": "5|6" } });

            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { AND: [{ categoryMetadata: { some: { categoryMetadataId: "1", metadataValueId: { in: ["5", "6"] } } } }] },
                })
            );
        });
    });
    describe("getAllProductsService - metadata edge cases", () => {
        it("ignora valor que não seja string", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

            const result = await getAllProductsService({ metadata: { "1": 123 as any } });

            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: {} })
            );
            expect(result).toEqual([])
        });

        it("ignora valor string vazia ou só espaços", async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

            const result = await getAllProductsService({ metadata: { "1": "   |  " } });

            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: {} })
            );
            expect(result).toEqual([])
        });
    });



    describe("getProductByIdService", () => {
        it("deve retornar produto com images formatado", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                name: "Produto Teste",
                description: "Desc",
                price: 100,
                categoryId: 2,
                images: [{ imageUrl: "img1.png" }, { imageUrl: "img2.png" }],
            });

            const result = await getProductByIdService(1);

            expect(result.images).toEqual(["media/products/img1.png", "media/products/img2.png"]);
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
            (prisma.product.update as jest.Mock).mockResolvedValue({});

            await incrementProductViewsService(1);

            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { viewsCount: { increment: 1 } },
            });
        });
    });


    describe("getProductsFromSameCategoryService", () => {
        it("deve retornar produtos da mesma categoria com image", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({ categoryId: 10 });
            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: 2, name: "Produto 2", price: 50, images: [{ imageUrl: "img2.png" }] },
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
            expect(result[0].image).toBe("media/products/img2.png");
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
