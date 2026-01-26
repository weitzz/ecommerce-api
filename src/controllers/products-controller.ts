
import { getProductByIdSchema } from '@/schemas/get-product-by-id-schema';
import { getProductSchema } from '@/schemas/get-product-schema';
import { getAllProductsService, getProductByIdService, getProductsFromSameCategoryService, incrementProductViewsService } from '@/services/products-service';
import { getAbsoluteImageUrl } from '@/utils/get-absolute-image-url';
import { RequestHandler } from 'express';
import { getCategoryService } from '@/services/category-service';
import { getProductsQuerySchema } from '@/schemas/get-product-query-schema';

export const getProducts: RequestHandler = async (req, res) => {
    const parseResult = getProductSchema.safeParse(req.query);

    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters' });
    }
    const { metadata, orderBy, order, limit, page, search } = parseResult.data;
    let parsedMetadata: Record<string, string[]> | undefined;

    try {
        parsedMetadata = metadata ? JSON.parse(metadata) : undefined;
    } catch {
        return res.status(400).json({ error: 'Invalid metadata format' });
    }


    const result = await getAllProductsService({
        metadata: parsedMetadata,
        orderBy,
        order,
        limit,
        page,
        search
    });

    const data = result.data.map(product => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false
    }));

    console.log(data)

    res.json({ data, meta: result.meta });

}

export const getProductById: RequestHandler = async (req, res) => {
    const productId = getProductByIdSchema.safeParse(req.params);

    if (!productId.success) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    const { id } = productId.data;
    const product = await getProductByIdService(parseInt(id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const productWithAbsoluteImages = {
        ...product,
        images: product.images.map(image => getAbsoluteImageUrl(image)),

    }
    await incrementProductViewsService(product.id);
    const category = await getCategoryService(product.categoryId);


    res.json({
        data: productWithAbsoluteImages,
        category
    });

}


export const getRelatedProducts: RequestHandler = async (req, res) => {
    const productId = getProductByIdSchema.safeParse(req.params);
    const queryResult = getProductsQuerySchema.safeParse(req.query);

    if (!productId.success || !queryResult.success) {
        return res.status(400).json({ error: 'Invalid product ID or query parameters' });
    }

    const { id } = productId.data;
    const { limit } = queryResult.data;
    const products = await getProductsFromSameCategoryService(parseInt(id), limit ? parseInt(limit) : undefined);

    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false

    }));

    res.json({ data: productsWithAbsoluteUrl });
}