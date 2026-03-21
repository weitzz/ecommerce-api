"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBannersService = void 0;
const prisma_1 = require("../libs/prisma");
const getAllBannersService = async () => {
    const banners = await prisma_1.prisma.banner.findMany({
        select: { imageUrl: true, linkUrl: true }
    });
    return banners.map(banner => ({
        imageUrl: `/media/banners/${banner.imageUrl}`,
        linkUrl: banner.linkUrl
    }));
};
exports.getAllBannersService = getAllBannersService;
