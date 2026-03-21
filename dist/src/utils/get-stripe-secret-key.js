"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripeSecretKey = void 0;
const getStripeSecretKey = () => {
    return process.env.STRIPE_SECRET_KEY || '';
};
exports.getStripeSecretKey = getStripeSecretKey;
