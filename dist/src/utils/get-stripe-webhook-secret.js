"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripeWebhookSecret = void 0;
const getStripeWebhookSecret = () => {
    return process.env.STRIPE_WEBHOOK_KEY || '';
};
exports.getStripeWebhookSecret = getStripeWebhookSecret;
