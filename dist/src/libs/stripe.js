"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripeCheckoutSession = exports.getConstructEvent = exports.createStripeCheckoutSession = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const products_service_1 = require("../services/products-service");
const get_stripe_secret_key_1 = require("../utils/get-stripe-secret-key");
const get_front_end_url_1 = require("../utils/get-front-end-url");
exports.stripe = new stripe_1.default((0, get_stripe_secret_key_1.getStripeSecretKey)());
const createStripeCheckoutSession = async ({ cart, shippingCost, orderId }) => {
    let stripeLineItems = [];
    for (let item of cart) {
        const product = await (0, products_service_1.getProductByIdService)(item.productId);
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
            });
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
        });
    }
    const session = await exports.stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: "payment",
        metadata: { orderId: orderId.toString() },
        success_url: `${(0, get_front_end_url_1.getFrontEndUrl)()}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${(0, get_front_end_url_1.getFrontEndUrl)()}/me`,
    });
    return session;
};
exports.createStripeCheckoutSession = createStripeCheckoutSession;
const getConstructEvent = async (rawBody, signature, webhookKey) => {
    try {
        return exports.stripe.webhooks.constructEvent(rawBody, signature, webhookKey);
    }
    catch (error) {
        return null;
    }
};
exports.getConstructEvent = getConstructEvent;
const getStripeCheckoutSession = async (sessionId) => {
    return await exports.stripe.checkout.sessions.retrieve(sessionId);
};
exports.getStripeCheckoutSession = getStripeCheckoutSession;
