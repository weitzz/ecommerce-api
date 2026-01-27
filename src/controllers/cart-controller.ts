import { cartMountSchema } from "@/schemas/cart-mount-schema";
import { RequestHandler } from "express";
import { getProductByIdService } from "@/services/products-service";
import { getAbsoluteImageUrl } from "@/utils/get-absolute-image-url";
import { calculateShippingSchema } from "@/schemas/calculate-shipping-schema";
import { cartFinishSchema } from "@/schemas/cart-finish-schema";
import { getAddressByIdService } from "@/services/user-service";
import { createOrderService } from "@/services/order-service";
import { createPaymentLinkService } from "@/services/payment-service";
import { HttpStatus } from "@/shared/http/status-codes";
import { AppError } from "@/shared/errors/app-error";



export const cartMont: RequestHandler = async (req, res) => {
    const result = cartMountSchema.safeParse(req.body);
    if (!result.success) {
        throw new AppError(
            "Invalid request body",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        );
    }

    const products = await Promise.all(
        result.data.ids.map(async (id) => {
            const product = await getProductByIdService(id)
            if (!product) return null

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]
                    ? getAbsoluteImageUrl(product.images[0])
                    : null,
            }
        })
    )


    return res.status(HttpStatus.OK).json({ success: true, data: products.filter(Boolean) });
}


export const calculateShipping: RequestHandler = async (req, res) => {
    const result = calculateShippingSchema.safeParse(req.query)
    if (!result.success) {
        throw new AppError(
            "Invalid CEP",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        );
    }

    return res.status(HttpStatus.OK).json({
        success: true,
        data: {
            zipcode: result.data.zipcode,
            shippingCost: 7,
            shippingDays: 3
        }
    });
}


export const finish: RequestHandler = async (req, res) => {
    const userId = req.user?.id

    if (!userId) {
        throw new AppError(
            "Access denied",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED,
        )
    }

    const result = cartFinishSchema.safeParse(req.body)
    if (!result.success) {
        throw new AppError(
            "Invalid cart",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        );
    }

    const { cart, addressId } = result.data

    const address = await getAddressByIdService(userId, addressId)
    if (!address) {

        throw new AppError(
            "Invalid address",
            "ADDRESS_NOT_FOUND",
            HttpStatus.BAD_REQUEST
        )
    }

    const orderId = await createOrderService({
        userId,
        cart,
        address,
        shippingCost: 7,
        shippingDays: 3
    })

    if (!orderId) {
        throw new AppError(
            "Failed to create order",
            "ORDER_CREATION_FAILED",
            HttpStatus.BAD_REQUEST
        )
    }

    const url = await createPaymentLinkService({
        cart,
        shippingCost: 7,
        orderId
    })

    if (!url) {
        throw new AppError(
            "Failed to create payment link",
            "PAYMENT_LINK_FAILED",
            HttpStatus.BAD_REQUEST
        )
    }

    return res.status(HttpStatus.CREATED).json({
        success: true,
        data: { url }
    });
}