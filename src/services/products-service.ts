import { ProductFilters } from "@/types/product.filters";
import { prisma } from "../libs/prisma";


export const getAllProductsService = async (filters: ProductFilters) => {
    const page = Math.max(filters.page ?? 1, 1)
    const limit = Math.min(filters.limit ?? 12, 50)
    const skip = (page - 1) * limit
    let orderBy: any = {}
    switch (filters.orderBy) {
        case 'views':
            orderBy = { viewsCount: filters.order ?? 'desc' }
            break

        case 'selling':
            orderBy = { price: filters.order ?? 'desc' }
            break

        case 'price':
            orderBy = { price: filters.order ?? 'asc' }
            break

        default:
            orderBy = { createdAt: 'desc' }
    }

    let where: any = {}
    const andFilters: any[] = []
    if (filters.metadata) {
        for (const categoryMetadataId in filters.metadata) {
            const values = filters.metadata[categoryMetadataId];
            if (!Array.isArray(values) || values.length === 0) continue

            andFilters.push({
                metadata: {
                    some: {
                        categoryMetadataId,
                        metadataValueId: { in: values }
                    }
                }
            })
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
        })
    }
    if (andFilters.length > 0) {
        where.AND = andFilters
    }


    const [products, total] = await Promise.all([
        prisma.product.findMany({
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
        prisma.product.count({ where })
    ])


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
    }
}



export const getProductByIdService = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            categoryId: true,
            images: true
        }
    })
    if (!product) {
        return null;
    }
    return {
        ...product,
        images: product.images.length > 0 ? product.images.map(img => `/media/products/${img.imageUrl}`) : []
    }
}


export const incrementProductViewsService = async (id: number) => {
    await prisma.product.updateMany({
        where: { id },
        data: {
            viewsCount: {
                increment: 1
            }
        }
    })
}

export const getProductsFromSameCategoryService = async (id: number, limit: number = 4) => {
    const product = await prisma.product.findUnique({
        where: { id },
        select: { categoryId: true }
    });
    if (!product) return []

    const products = await prisma.product.findMany({
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
    })
    )
} 