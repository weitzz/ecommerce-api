import { CartItem } from "@/types/cart-item";
import { Address } from "@/types/address";
import { prisma } from "@/libs/prisma";
import { getProductByIdService } from "./products-service";
type CreateOrderParams = {
    userId: number;
    cart: CartItem[];
    address: Address;
    shippingCost: number;
    shippingDays: number;
};


export const createOrder = async ({ userId, address, shippingCost, shippingDays, cart }: CreateOrderParams) => {
    let subtotal = 0
    let orderItems = []

    for (let cartItem of cart) {
        const product = await getProductByIdService(cartItem.productId)
        if (product) {
            subtotal += product.price * cartItem.quantity
        }
        orderItems.push({
            productId: product.id,
            quantity: cartItem.quantity,
            price: product.price
        })

    }

    let total = subtotal + shippingCost

    const order = await prisma.order.create({
        data: {
            userId,
            totalPrice: total,
            shippingCost,
            shippingDays,
            shippingZipcode: address.zipcode,
            shippingStreet: address.street,
            shippingNumber: address.number,
            shippingCity: address.city,
            shippingState: address.state,
            shippingCountry: address.country,
            shippingComplement: address.complement,
            orderProducts: { create: orderItems },
        }
    })

    if (!order) return null;

    return order.id
}


export const updateOrderStatus = async (orderId: number, status: "paid" | 'canceled') => {
    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    })
}