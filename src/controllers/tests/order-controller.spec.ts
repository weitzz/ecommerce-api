jest.mock("@/middleware/auth", () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));

jest.mock("@/services/order-service");
jest.mock("@/services/payment-service");
import request from "supertest";
import app from "@/app";

import { getOrderByIdService, getUserOrdersService } from "@/services/order-service";

import { getOrderIdFromSessionService } from "@/services/payment-service";




describe("Order controller (unauth)", () => {
    it("deve retornar 401 ao acessar /orders", async () => {
        jest.resetModules();
        jest.doMock("@/middleware/auth", () => ({
            authMiddleware: (_req: any, _res: any, next: any) => next(),
        }));
        const app = (await import("@/app")).default;
        const request = (await import("supertest")).default;
        const res = await request(app).get("/orders");

        expect(res.status).toBe(401);
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
});


describe("GET /orders", () => {
    it("deve retornar lista de pedidos do usuário autenticado", async () => {
        (getUserOrdersService as jest.Mock).mockResolvedValue([
            { id: 1, total: 100 },
            { id: 2, total: 200 },
        ]);

        const res = await request(app).get("/orders");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(2);
    });
});


describe("GET /orders/:id", () => {
    it("deve retornar 400 se ID for inválido", async () => {
        const res = await request(app)
            .get("/orders/teste")
            .query({});

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("deve retornar 404 se pedido não for encontrado", async () => {
        (getOrderIdFromSessionService as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .get("/orders/10")

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe("ORDER_NOT_FOUND");
    });

    it("deve retornar pedido quando ID for válido", async () => {
        (getOrderByIdService as jest.Mock).mockResolvedValue({
            id: 10,
            total: 150,
            status: 'paid'
        });

        const res = await request(app)
            .get("/orders/10")
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    id: 10,
                    total: 150,
                    status: "paid",
                })
            })
        )
    });
});
