import { CartItem } from "./cart-item";

export type CreatePaymentParams = {
    cart: CartItem[];
    shippingCost: number
    orderId: number
}