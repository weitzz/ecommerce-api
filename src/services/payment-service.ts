import { createStripeCheckoutSession, getStripeCheckoutSession } from "../libs/stripe";
import { CreatePaymentParams } from "@/types/payments";




export const createPaymentLinkService = async ({ cart, shippingCost, orderId }: CreatePaymentParams) => {
    try {
        const session = await createStripeCheckoutSession({ cart, shippingCost, orderId });
        if (!session) return null;
        return session.url;
    } catch (error) {
        console.error("Stripe create session error:", error);
        return null;
    }

}

export const getOrderIdFromSessionService = async (sessionId: string) => {
    try {
        const session = await getStripeCheckoutSession(sessionId);
        const orderId = session.metadata?.orderId;
        if (!orderId) return null;

        return parseInt(orderId);
    } catch (error) {
        console.error("Stripe create session error:", error);
        return null;
    }

}
