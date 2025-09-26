import {
    createPaymentLinkService,
    getOrderIdFromSessionService,
} from "../payment-service";
import {
    createStripeCheckoutSession,
    getStripeCheckoutSession,
} from "../../libs/stripe";


jest.mock("../../libs/stripe", () => ({
    createStripeCheckoutSession: jest.fn(),
    getStripeCheckoutSession: jest.fn(),
}));

describe("Payment Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createPaymentLinkService", () => {
        const mockParams = {
            cart: [{ productId: 1, quantity: 2 }],
            shippingCost: 20,
            orderId: 99,
        };

        it("deve retornar a URL da sessão de pagamento", async () => {
            (createStripeCheckoutSession as jest.Mock).mockResolvedValue({
                url: "https://checkout.stripe.com/test-session",
            });

            const result = await createPaymentLinkService(mockParams);

            expect(createStripeCheckoutSession).toHaveBeenCalledWith(mockParams);
            expect(result).toBe("https://checkout.stripe.com/test-session");
        });

        it("deve retornar null se sessão não for criada", async () => {
            (createStripeCheckoutSession as jest.Mock).mockResolvedValue(null);

            const result = await createPaymentLinkService(mockParams);

            expect(result).toBeNull();
        });

        it("deve retornar null se lançar erro", async () => {
            (createStripeCheckoutSession as jest.Mock).mockRejectedValue(
                new Error("Stripe error")
            );

            const result = await createPaymentLinkService(mockParams);

            expect(result).toBeNull();
        });
    });

    describe("getOrderIdFromSessionService", () => {
        it("deve retornar o orderId da sessão", async () => {
            (getStripeCheckoutSession as jest.Mock).mockResolvedValue({
                metadata: { orderId: "123" },
            });

            const result = await getOrderIdFromSessionService("session_abc");

            expect(getStripeCheckoutSession).toHaveBeenCalledWith("session_abc");
            expect(result).toBe(123);
        });

        it("deve retornar null se não houver orderId na metadata", async () => {
            (getStripeCheckoutSession as jest.Mock).mockResolvedValue({
                metadata: {},
            });

            const result = await getOrderIdFromSessionService("session_xyz");

            expect(result).toBeNull();
        });

        it("deve retornar null se lançar erro", async () => {
            (getStripeCheckoutSession as jest.Mock).mockRejectedValue(
                new Error("Stripe error")
            );

            const result = await getOrderIdFromSessionService("session_fail");

            expect(result).toBeNull();
        });
    });
});
