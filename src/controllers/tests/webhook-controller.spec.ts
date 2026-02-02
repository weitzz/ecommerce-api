import request from 'supertest';

jest.mock("@/libs/stripe");
jest.mock("@/services/order-service", () => ({
    _esModule: true,
    updateOrderStatusService: jest.fn()
}));
jest.mock("@/utils/get-stripe-webhook-secret");

import app from '@/app';
import { getConstructEvent } from '@/libs/stripe'
import { updateOrderStatusService } from "@/services/order-service";
import { getStripeWebhookSecret } from '@/utils/get-stripe-webhook-secret'

describe("POST /webhook/stripe", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getStripeWebhookSecret as jest.Mock).mockReturnValue("whsec_test");
    });

    it("deve marcar pedido como pago quando checkout.session.completed", async () => {
        (getConstructEvent as jest.Mock).mockResolvedValue({
            type: "checkout.session.completed",
            data: {
                object: {
                    metadata: { orderId: "10" },
                },
            },
        });

        const res = await request(app)
            .post("/webhook/stripe")
            .set("stripe-signature", "sig_test")
            .send("raw-body-fake");
        expect(updateOrderStatusService).toHaveBeenCalledWith(10, "paid");
        expect(res.body).toEqual({ received: true });
    });

    it("deve marcar pedido como pago quando async_payment_succeeded", async () => {
        (getConstructEvent as jest.Mock).mockResolvedValue({
            type: "checkout.session.async_payment_succeeded",
            data: {
                object: {
                    metadata: { orderId: "11" },
                },
            },
        });

        await request(app)
            .post("/webhook/stripe")
            .set("stripe-signature", "sig_test")
            .send("raw-body-fake");

        expect(updateOrderStatusService).toHaveBeenCalledWith(11, "paid");
    });

    it("deve marcar pedido como cancelado quando checkout.session.expired", async () => {
        (getConstructEvent as jest.Mock).mockResolvedValue({
            type: "checkout.session.expired",
            data: {
                object: {
                    metadata: { orderId: "12" },
                },
            },
        });

        await request(app)
            .post("/webhook/stripe")
            .set("stripe-signature", "sig_test")
            .send("raw-body-fake");

        expect(updateOrderStatusService).toHaveBeenCalledWith(12, "canceled");
    });

    it("não deve atualizar pedido se evento for inválido", async () => {
        (getConstructEvent as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .post("/webhook/stripe")
            .set("stripe-signature", "sig_test")
            .send("raw-body-fake");

        expect(updateOrderStatusService).not.toHaveBeenCalled();
        expect(res.body).toEqual({ received: true });
    });
});