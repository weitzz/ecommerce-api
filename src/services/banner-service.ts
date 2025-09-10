import { prisma } from "@/libs/prisma";

export const getAllBanners = async () => {
    const banners = await prisma.banner.findMany({
        select: { imageUrl: true, linkUrl: true }
    });

    return banners.map(banner => ({
        imageUrl: `media/banners/${banner.imageUrl}`,

    }));

}