import { createStripeCheckoutSession, getStripeCheckoutSession } from "@/libs/stripe";
import { CreatePaymentParams } from "@/types/payments";




export const createPaymentLink = async ({ cart, shippingCost, orderId }: CreatePaymentParams) => {
    try {
        const session = await createStripeCheckoutSession({ cart, shippingCost, orderId });
        if (!session) return null;
        return session.url;
    } catch (error) {
        return null;
    }

}

export const getOrderIdFromSession = async (sessionId: string) => {
    try {
        const session = await getStripeCheckoutSession(sessionId);
        const orderId = session.metadata?.orderId;
        if (!orderId) return null;

        return parseInt(orderId);
    } catch (error) {
        return null;
    }

}