import { prisma } from "../libs/prisma";

type ProductFilters = {
    metadata?: Record<string, string[]>
    order?: string;
    limit?: number;
    search?: string;
}
export const getAllProductsService = async (filters: ProductFilters) => {
    let orderBy = {}
    switch (filters.order) {
        case 'views':
        default:
            orderBy = { viewsCount: 'desc' };
            break;
        case 'selling':
            orderBy = { price: 'desc' };
            break;
        case 'price':
            orderBy = { price: 'asc' };
            break;
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
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            images: {
                take: 1,
                orderBy: { id: 'asc' }
            }
        },
        where,
        orderBy,
        take: filters.limit ?? undefined
    });
    return products.map(product => ({
        ...product,
        image: product.images[0] ? `/media/products/${product.images[0].imageUrl}` : null,
        images: undefined
    }));
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
    await prisma.product.update({
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