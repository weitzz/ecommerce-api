"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByIdService = exports.getUserOrdersService = exports.updateOrderStatusService = exports.createOrderService = void 0;
const prisma_1 = require("../libs/prisma");
const products_service_1 = require("./products-service");
const createOrderService = async ({ userId, address, shippingCost, shippingDays, cart }) => {
    let subtotal = 0;
    let orderItems = [];
    for (let cartItem of cart) {
        const product = await (0, products_service_1.getProductByIdService)(cartItem.productId);
        if (product) {
            subtotal += product.price * cartItem.quantity;
            orderItems.push({
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price
            });
        }
    }
    let total = subtotal + shippingCost;
    const order = await prisma_1.prisma.order.create({
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
    });
    if (!order)
        return null;
    return order.id;
};
exports.createOrderService = createOrderService;
const updateOrderStatusService = async (orderId, status) => {
    await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
};
exports.updateOrderStatusService = updateOrderStatusService;
const getUserOrdersService = async (userId) => {
    return await prisma_1.prisma.order.findMany({
        where: { userId },
        select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getUserOrdersService = getUserOrdersService;
const getOrderByIdService = async (id, userId) => {
    const order = await prisma_1.prisma.order.findFirst({
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
    if (!order)
        return null;
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
    };
};
exports.getOrderByIdService = getOrderByIdService;
