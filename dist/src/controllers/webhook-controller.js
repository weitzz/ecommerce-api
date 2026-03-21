"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = require("../libs/stripe");
const order_service_1 = require("../services/order-service");
const get_stripe_webhook_secret_1 = require("../utils/get-stripe-webhook-secret");
const stripe = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const webhookKey = (0, get_stripe_webhook_secret_1.getStripeWebhookSecret)();
    const rawBody = req.body;
    const event = await (0, stripe_1.getConstructEvent)(rawBody, signature, webhookKey);
    if (event) {
        const session = event.data.object;
        const orderId = Number(session.metadata?.orderId);
        switch (event.type) {
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded':
                await (0, order_service_1.updateOrderStatusService)(orderId, 'paid');
                break;
            case 'checkout.session.expired':
            case 'checkout.session.async_payment_failed':
                await (0, order_service_1.updateOrderStatusService)(orderId, 'canceled');
                break;
        }
    }
    res.json({ received: true });
};
exports.stripe = stripe;
