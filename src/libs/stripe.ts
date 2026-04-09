import Stripe from 'stripe'
import { getProductByIdService } from '@/services/products-service';
import { CreatePaymentParams } from "@/types/payments";
import { getStripeSecretKey } from '@/utils/get-stripe-secret-key';

import { getFrontEndUrl } from '@/utils/get-front-end-url';



export const stripe = new Stripe(getStripeSecretKey())


export const createStripeCheckoutSession = async ({ cart, shippingCost, orderId }: CreatePaymentParams) => {
    const frontEndUrl = getFrontEndUrl();
    let stripeLineItems = [];
    for (let item of cart) {
        const product = await getProductByIdService(item.productId);
        if (product) {
            stripeLineItems.push({
                price_data: {
                    product_data: {
                        name: product.name,
                    },
                    currency: "BRL",
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            })
        }
    }

    if (shippingCost > 0) {
        stripeLineItems.push({
            price_data: {
                product_data: {
                    name: "Frete"
                },
                currency: "BRL",
                unit_amount: Math.round(shippingCost * 100),

            },
            quantity: 1
        })
    }

    const session = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: "payment",
        metadata: { orderId: orderId.toString() },
        success_url: `${frontEndUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontEndUrl}/me`,
    })


    return session;

}

export const getConstructEvent = async (rawBody: string, signature: string, webhookKey: string) => {
    try {
        return stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookKey
        );
    } catch (error) {
        return null;
    }
}

export const getStripeCheckoutSession = async (sessionId: string) => {
    return await stripe.checkout.sessions.retrieve(sessionId);
}
