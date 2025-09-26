import { prisma } from "../../libs/prisma"
import { getCategoryBySlugService, getCategoryMetadataService, getCategoryService } from "../category-service"

jest.mock("../../libs/prisma", () => ({
    prisma: {
        category: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
        },
        categoryMetadata: {
            findMany: jest.fn(),
        },
    }
}));


describe("Category Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getCategoryService", () => {
        it("deve retornar uma categoria por id", async () => {
            const mockCategory = { id: 1, name: "Eletrônicos", slug: "eletronicos" };
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

            const result = await getCategoryService(1);

            expect(prisma.category.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                select: { id: true, name: true, slug: true },
            });
            expect(result).toEqual(mockCategory);
        });

        it("deve retornar null se a categoria não existir", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await getCategoryService(999);

            expect(result).toBeNull();
        });
    });

    describe("getCategoryBySlugService", () => {
        it("deve retornar uma categoria por slug", async () => {
            const mockCategory = { id: 2, name: "Roupas", slug: "roupas" };
            (prisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);

            const result = await getCategoryBySlugService("roupas");

            expect(prisma.category.findFirst).toHaveBeenCalledWith({
                where: { slug: "roupas" },
                select: { id: true, name: true, slug: true },
            });
            expect(result).toEqual(mockCategory);
        });

        it("deve retornar null se a categoria não existir pelo slug", async () => {
            (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getCategoryBySlugService("nao-existe");

            expect(result).toBeNull();
        });
    });

    describe("getCategoryMetadataService", () => {
        it("deve retornar metadados da categoria", async () => {
            const mockMetadata = [
                {
                    id: 1,
                    name: "Cor",
                    values: [
                        { id: 10, label: "Vermelho" },
                        { id: 11, label: "Azul" },
                    ],
                },
            ];
            (prisma.categoryMetadata.findMany as jest.Mock).mockResolvedValue(
                mockMetadata
            );

            const result = await getCategoryMetadataService(1);

            expect(prisma.categoryMetadata.findMany).toHaveBeenCalledWith({
                where: { categoryId: 1 },
                select: {
                    id: true,
                    name: true,
                    values: { select: { id: true, label: true } },
                },
            });
            expect(result).toEqual(mockMetadata);
        });

        it("deve retornar array vazio se não houver metadados", async () => {
            (prisma.categoryMetadata.findMany as jest.Mock).mockResolvedValue([]);

            const result = await getCategoryMetadataService(1);

            expect(result).toEqual([]);
        });
    });
});