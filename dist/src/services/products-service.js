"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsFromSameCategoryService = exports.incrementProductViewsService = exports.getProductByIdService = exports.getAllProductsService = void 0;
const prisma_1 = require("../libs/prisma");
const getAllProductsService = async (filters) => {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(filters.limit ?? 12, 50);
    const skip = (page - 1) * limit;
    let orderBy = {};
    switch (filters.orderBy) {
        case 'views':
            orderBy = { viewsCount: filters.order ?? 'desc' };
            break;
        case 'selling':
            orderBy = { price: filters.order ?? 'desc' };
            break;
        case 'price':
            orderBy = { price: filters.order ?? 'asc' };
            break;
        default:
            orderBy = { createdAt: 'desc' };
    }
    let where = {};
    const andFilters = [];
    if (filters.metadata) {
        for (const categoryMetadataId in filters.metadata) {
            const values = filters.metadata[categoryMetadataId];
            if (!Array.isArray(values) || values.length === 0)
                continue;
            andFilters.push({
                metadata: {
                    some: {
                        categoryMetadataId,
                        metadataValueId: { in: values }
                    }
                }
            });
        }
    }
    if (filters.search) {
        andFilters.push({
            OR: [
                {
                    name: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: filters.search,
                        mode: "insensitive"
                    }
                }
            ]
        });
    }
    if (andFilters.length > 0) {
        where.AND = andFilters;
    }
    const [products, total] = await Promise.all([
        prisma_1.prisma.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                price: true,
                images: {
                    take: 1,
                    orderBy: { id: 'asc' }
                }
            }
        }),
        prisma_1.prisma.product.count({ where })
    ]);
    const data = products.map(product => ({
        ...product,
        image: product.images[0] ? `/media/products/${product.images[0].imageUrl}` : null,
        images: undefined,
    }));
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
exports.getAllProductsService = getAllProductsService;
const getProductByIdService = async (id) => {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            categoryId: true,
            images: true
        }
    });
    if (!product) {
        return null;
    }
    return {
        ...product,
        images: product.images.length > 0 ? product.images.map(img => `/media/products/${img.imageUrl}`) : []
    };
};
exports.getProductByIdService = getProductByIdService;
const incrementProductViewsService = async (id) => {
    await prisma_1.prisma.product.updateMany({
        where: { id },
        data: {
            viewsCount: {
                increment: 1
            }
        }
    });
};
exports.incrementProductViewsService = incrementProductViewsService;
const getProductsFromSameCategoryService = async (id, limit = 4) => {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id },
        select: { categoryId: true }
    });
    if (!product)
        return [];
    const products = await prisma_1.prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            id: { not: id }
        },
        select: {
            id: true,
            name: true,
            price: true,
            images: {
                take: 1,
                orderBy: { id: 'asc' }
            }
        },
        take: limit,
        orderBy: { viewsCount: 'desc' }
    });
    return products.map(product => ({
        ...product,
        image: product.images[0] ? `/media/products/${product.images[0].imageUrl}` : null,
        images: undefined
    }));
};
exports.getProductsFromSameCategoryService = getProductsFromSameCategoryService;
