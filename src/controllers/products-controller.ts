
import { getProductByIdSchema } from '@/schemas/get-product-by-id-schema';
import { getProductSchema } from '@/schemas/get-product-schema';
import { getAllProductsService, getProductByIdService, getProductsFromSameCategoryService, incrementProductViewsService } from '@/services/products-service';
import { getAbsoluteImageUrl } from '@/utils/get-absolute-image-url';
import { RequestHandler } from 'express';
import { getCategoryService } from '@/services/category-service';
import { getProductsQuerySchema } from '@/schemas/get-product-query-schema';
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";


export const getProducts: RequestHandler = async (req, res) => {
    const parseResult = getProductSchema.safeParse(req.query);

    if (!parseResult.success) {
        throw new AppError(
            "Invalid query parameters",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            parseResult.error.flatten()
        );
    }
    const { metadata, orderBy, order, limit, page, search } = parseResult.data;
    let parsedMetadata: Record<string, string[]> | undefined;

    try {
        parsedMetadata = metadata ? JSON.parse(metadata) : undefined;
    } catch {
        throw new AppError(
            "Invalid metadata format",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST
        );
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


    return res.status(HttpStatus.OK).json({ success: true, data, meta: result.meta });

}

export const getProductById: RequestHandler = async (req, res) => {
    const productId = getProductByIdSchema.safeParse(req.params);

    if (!productId.success) {
        throw new AppError(
            "Invalid product ID",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            productId.error.flatten()
        );
    }

    const { id } = productId.data;
    const product = await getProductByIdService(Number(id));
    if (!product) {
        throw new AppError(
            "Product not found",
            "PRODUCT_NOT_FOUND",
            HttpStatus.NOT_FOUND
        )
    }

    const productWithAbsoluteImages = {
        ...product,
        images: product.images.map(image => getAbsoluteImageUrl(image)),

    }
    await incrementProductViewsService(product.id);
    const category = await getCategoryService(product.categoryId);


    return res.status(HttpStatus.OK).json({
        success: true,
        data: {
            product: productWithAbsoluteImages,
            category
        }
    });

}


export const getRelatedProducts: RequestHandler = async (req, res) => {
    const productId = getProductByIdSchema.safeParse(req.params);
    const queryResult = getProductsQuerySchema.safeParse(req.query);

    if (!productId.success || !queryResult.success) {
        throw new AppError(
            "Invalid product ID or query parameters",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            {
                ...(!productId.success ? { params: productId.error.flatten() } : {}),
                ...(!queryResult.success ? { query: queryResult.error.flatten() } : {}),
            }
        )
    }

    const { id } = productId.data;
    const { limit } = queryResult.data;
    const products = await getProductsFromSameCategoryService(parseInt(id), limit ? parseInt(limit) : undefined);

    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false

    }));

    return res.status(HttpStatus.OK).json({ success: true, data: productsWithAbsoluteUrl });
}