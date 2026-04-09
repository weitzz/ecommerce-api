jest.mock("@/middleware/auth", () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));

jest.mock("@/services/products-service");
jest.mock("@/services/user-service");
jest.mock("@/services/order-service");
jest.mock("@/services/payment-service");

import request from "supertest";
import app from "@/app";

import { getProductByIdService } from "@/services/products-service";
import { getAddressByIdService } from "@/services/user-service";
import { createOrderService } from "@/services/order-service";
import { createPaymentLinkService } from "@/services/payment-service";

describe("POST /cart/mount", () => {
    it("deve retornar 400 se body for inválido", async () => {
        const res = await request(app)
            .post("/cart/mount")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBeFalsy();
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    message: 'Dados inválidos no corpo da requisição',
                    code: 'VALIDATION_ERROR',
                }),
            })
        )
    });

    it("deve montar o carrinho com produtos válidos", async () => {
        (getProductByIdService as jest.Mock).mockResolvedValue({
            id: 1,
            name: "Produto Teste",
            price: 100,
            images: ["img.png"],
        });

        const res = await request(app)
            .post("/cart/mount")
            .send({ ids: [1] });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0]).toEqual(
            expect.objectContaining({
                id: 1,
                name: "Produto Teste",
                price: 100,
                image: expect.any(String),
            })
        );
    });

    it("deve filtrar produtos inexistentes", async () => {
        (getProductByIdService as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .post("/cart/mount")
            .send({ ids: [999] });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(0);
    });
});

describe("GET /cart/shipping", () => {
    it("deve retornar erro se CEP for inválido", async () => {
        const res = await request(app)
            .get("/cart/shipping")
            .query({ zipcode: "123" });
        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    message: 'CEP inválido',
                    code: 'VALIDATION_ERROR',
                }),
            })
        )
    });

    it("deve retornar valor de frete com CEP válido", async () => {
        const res = await request(app)
            .get("/cart/shipping")
            .query({ zipcode: "12345678" });

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({
            zipcode: "12345678",
            shippingCost: 7,
            shippingDays: 3,
        });
    });
});
describe("POST /cart/finish", () => {
    it("deve retornar 401 se usuário não estiver autenticado", async () => {
        jest.resetModules();
        jest.doMock("@/middleware/auth", () => ({
            authMiddleware: (_req: any, _res: any, next: any) => next(),
        }));
        const app = (await import("@/app")).default;
        const request = (await import("supertest")).default;

        const res = await request(app)
            .post("/cart/finish")
            .send({});
        expect(res.status).toBe(401)
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    message: 'Acesso negado',
                    code: 'UNAUTHORIZED',
                }),
            })
        )
    });

    it("deve finalizar o carrinho com sucesso", async () => {
        (getAddressByIdService as jest.Mock).mockResolvedValue({
            street: "Rua Teste",
        });

        (createOrderService as jest.Mock).mockResolvedValue(10);

        (createPaymentLinkService as jest.Mock).mockResolvedValue(
            "https://pay.test"
        );

        const res = await request(app)
            .post("/cart/finish")
            .send({
                cart: [{ productId: 1, quantity: 1 }],
                addressId: 2,
            });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.url).toBe("https://pay.test");
        expect(res.body.checkoutUrl).toBe("https://pay.test");
        expect(res.body.data.url).toBe("https://pay.test");
        expect(res.body.data.checkoutUrl).toBe("https://pay.test");
    });

    it("deve retornar erro se endereço não existir", async () => {
        (getAddressByIdService as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .post("/cart/finish")
            .send({
                cart: [{ productId: 1, quantity: 1 }],
                addressId: 2,
            });
        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    message: 'Endereço inválido',
                    code: 'ADDRESS_NOT_FOUND',
                }),
            })
        )
    });
});
