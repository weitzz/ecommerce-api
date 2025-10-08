
import { prisma } from "@/libs/prisma";
import { getAllBannersService } from "@/services/banner-service";


jest.mock("@/libs/prisma", () => ({
    prisma: {
        banner: {
            findMany: jest.fn()
        }
    }
}));

describe("getAllBannersService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve retornar banners formatados corretamente", async () => {
        (prisma.banner.findMany as jest.Mock).mockResolvedValue([
            { imageUrl: "banner1.png", linkUrl: "https://example.com/1" },
            { imageUrl: "banner2.jpg", linkUrl: "https://example.com/2" }
        ]);

        const result = await getAllBannersService();

        expect(prisma.banner.findMany).toHaveBeenCalledWith({
            select: { imageUrl: true, linkUrl: true }
        });

        expect(result).toEqual([
            { imageUrl: "media/banners/banner1.png" },
            { imageUrl: "media/banners/banner2.jpg" }
        ]);
    });

    it("deve retornar array vazio se não houver banners", async () => {
        (prisma.banner.findMany as jest.Mock).mockResolvedValue([]);

        const result = await getAllBannersService();

        expect(result).toEqual([]);
    });
});
