import { cartMountSchema } from "@/schemas/cart-mount-schema";
import { RequestHandler } from "express";
import { getProductByIdService } from "../services/products-service";
import { getAbsoluteImageUrl } from "@/utils/get-absolute-image-url";
import { calculateShippingSchema } from "@/schemas/calculate-shipping-schema";

export const cartMont: RequestHandler = async (req, res) => {
    const parseResult = cartMountSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    const { ids } = parseResult.data;
    let products = [];

    for (let id of ids) {
        const product = await getProductByIdService(id)
        if (product) {
            products.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ? getAbsoluteImageUrl(product.images[0]) : null
            })
        }
    }

    res.json({ error: null, products });
}


export const calculateShipping: RequestHandler = async (req, res) => {
    const parseResult = calculateShippingSchema.safeParse(req.query)
    if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid CEP" });
    }
    const { zipcode } = parseResult.data

    res.json({ error: null, zipcode, cost: 7, days: 3 });
}