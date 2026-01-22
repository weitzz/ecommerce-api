import { cartMountSchema } from "@/schemas/cart-mount-schema";
import { RequestHandler } from "express";
import { getProductByIdService } from "@/services/products-service";
import { getAbsoluteImageUrl } from "@/utils/get-absolute-image-url";
import { calculateShippingSchema } from "@/schemas/calculate-shipping-schema";
import { cartFinishSchema } from "@/schemas/cart-finish-schema";
import { getAddressByIdService } from "@/services/user-service";
import { createOrderService } from "@/services/order-service";
import { createPaymentLinkService } from "@/services/payment-service";

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


export const finish: RequestHandler = async (req, res) => {
    const userId = req.user?.id

    if (!userId) {
        return res.status(401).json({ error: "Access denied" });
    }

    const result = cartFinishSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ error: "Invalid cart" });
    }

    const { cart, addressId } = result.data

    const address = await getAddressByIdService(userId, addressId)
    if (!address) {
        return res.status(400).json({ error: "Invalid address" });
    }

    const shippingCost = 7
    const shippingDays = 3

    const orderId = await createOrderService({
        userId,
        cart,
        address,
        shippingCost,
        shippingDays
    })

    if (!orderId) {
        return res.status(400).json({ error: "Failed to create order" });
    }

    const url = await createPaymentLinkService({
        cart,
        shippingCost,
        orderId
    })

    if (!url) {
        return res.status(400).json({ error: "Failed to create payment link" });
    }

    return res.status(201).json({ error: null, url });
}