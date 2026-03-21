"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryMetadataService = exports.getCategoryBySlugService = exports.getCategoryService = void 0;
const prisma_1 = require("../libs/prisma");
const getCategoryService = async (id) => {
    const category = await prisma_1.prisma.category.findUnique({
        where: { id },
        select: {
            id: true, name: true, slug: true
        }
    });
    return category;
};
exports.getCategoryService = getCategoryService;
const getCategoryBySlugService = async (slug) => {
    const category = await prisma_1.prisma.category.findFirst({
        where: { slug },
        select: {
            id: true, name: true, slug: true
        }
    });
    return category;
};
exports.getCategoryBySlugService = getCategoryBySlugService;
const getCategoryMetadataService = async (id) => {
    const metadata = await prisma_1.prisma.categoryMetadata.findMany({
        where: { categoryId: id },
        select: {
            id: true,
            name: true,
            values: {
                select: { id: true, label: true }
            },
        }
    });
    return metadata;
};
exports.getCategoryMetadataService = getCategoryMetadataService;
