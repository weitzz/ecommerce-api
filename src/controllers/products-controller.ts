
import { getProductByIdSchema } from '@/schemas/get-product-by-id-schema';
import { getProductSchema } from '@/schemas/get-product-schema';
import { getAllProductsService, getProductByIdService, incrementProductViews } from '@/services/products-service';
import { getAbsoluteImageUrl } from '@/utils/get-absolute-image-url';
import { RequestHandler } from 'express';
import { getCategoryService } from '@/services/category-service';

export const getProducts: RequestHandler = async (req, res) => {
    const parseResult = getProductSchema.safeParse(req.query);

    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters' });
    }
    const { metadata, orderBy, limit } = parseResult.data;
    const parsedLimit = limit ? parseInt(limit) : undefined;
    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;


    const products = await getAllProductsService({ metadata: parsedMetadata, order: orderBy, limit: parsedLimit });
    return res.json(products);

    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false

    }));

    res.json({ error: null, data: productsWithAbsoluteUrl })

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
    await incrementProductViews(product.id);


    res.json({ error: null, data: productWithAbsoluteImages, category });

}