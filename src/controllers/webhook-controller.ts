import { getConstructEvent } from "@/libs/stripe";
import { updateOrderStatusService } from "@/services/order-service";
import { getStripeWebhookSecret } from "@/utils/get-stripe-webhook-secret";
import { RequestHandler } from "express";
import Stripe from "stripe";

export const stripe: RequestHandler = async (req, res) => {
    const signature = req.headers['stripe-signature'] as string
    const webhookKey = getStripeWebhookSecret()
    const rawBody = req.body
    const event = await getConstructEvent(rawBody, signature, webhookKey)
    if (event) {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = Number(session.metadata?.orderId)


        switch (event.type) {
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded':

                await updateOrderStatusService(orderId, 'paid')
                break;
            case 'checkout.session.expired':
            case 'checkout.session.async_payment_failed':
                await updateOrderStatusService(orderId, 'canceled')
                break;

        }
    }

    res.json({ received: true });
}