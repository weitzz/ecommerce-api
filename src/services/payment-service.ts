import { createStripeCheckoutSession } from "@/libs/stripe";
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