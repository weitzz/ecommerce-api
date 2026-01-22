import { CartItem } from "@/types/cart-item";
import { Address } from "@/types/address";
import { prisma } from "../libs/prisma";
import { getProductByIdService } from "./products-service";
type CreateOrderParams = {
    userId: number;
    cart: CartItem[];
    address: Address;
    shippingCost: number;
    shippingDays: number;
};


export const createOrderService = async ({ userId, address, shippingCost, shippingDays, cart }: CreateOrderParams) => {
    let subtotal = 0
    let orderItems = []

    for (let cartItem of cart) {
        const product = await getProductByIdService(cartItem.productId)
        if (product) {
            subtotal += product.price * cartItem.quantity
            orderItems.push({
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price
            })
        }

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


export const updateOrderStatusService = async (orderId: number, status: "paid" | 'canceled') => {
    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    })
}

export const getUserOrdersService = async (userId: number) => {
    return await prisma.order.findMany({
        where: { userId },
        select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    })
}

export const getOrderByIdService = async (id: number, userId: number) => {
    const order = await prisma.order.findFirst({
        where: { id, userId },
        select: {
            id: true,
            status: true,
            totalPrice: true,
            shippingCost: true,
            shippingDays: true,
            shippingCity: true,
            shippingComplement: true,
            shippingCountry: true,
            shippingNumber: true,
            shippingState: true,
            shippingStreet: true,
            shippingZipcode: true,
            createdAt: true,
            orderProducts: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            images: {
                                take: 1,
                                orderBy: { id: 'asc' }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!order) return null;

    return {
        ...order,
        orderItems: order.orderProducts.map(item => ({
            ...item,
            product: {
                ...item.product,
                image: item.product.images[0] ? `media/products/${item.product.images[0].imageUrl}` : null,
                images: undefined
            }
        }))
    }
}