"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderIdFromSessionService = exports.createPaymentLinkService = void 0;
const stripe_1 = require("../libs/stripe");
const createPaymentLinkService = async ({ cart, shippingCost, orderId }) => {
    try {
        const session = await (0, stripe_1.createStripeCheckoutSession)({ cart, shippingCost, orderId });
        if (!session)
            return null;
        return session.url;
    }
    catch (error) {
        console.error("Stripe create session error:", error);
        return null;
    }
};
exports.createPaymentLinkService = createPaymentLinkService;
const getOrderIdFromSessionService = async (sessionId) => {
    try {
        const session = await (0, stripe_1.getStripeCheckoutSession)(sessionId);
        const orderId = session.metadata?.orderId;
        if (!orderId)
            return null;
        return parseInt(orderId);
    }
    catch (error) {
        console.error("Stripe create session error:", error);
        return null;
    }
};
exports.getOrderIdFromSessionService = getOrderIdFromSessionService;
