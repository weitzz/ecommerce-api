
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
    const { metadata, orderBy, limit } = parseResult.data;
    const parsedLimit = limit ? parseInt(limit) : undefined;
    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;


    const products = await getAllProductsService({ metadata: parsedMetadata, order: orderBy, limit: parsedLimit });

    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false
    }));

    return res.json(productsWithAbsoluteUrl);

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
    const category = await getCategoryService(product.categoryId);
    await incrementProductViewsService(product.id);


    res.json({ productWithAbsoluteImages, category });

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

    res.json(productsWithAbsoluteUrl);
}