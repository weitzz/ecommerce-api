jest.mock("@/middleware/auth", () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));
jest.mock('@/services/favorite-service', () => ({
    toggleFavoriteService: jest.fn(),
    listFavoritesByUserService: jest.fn(),
    removeFavoriteService: jest.fn(),
}));
import request from "supertest";
import app from "@/app";
import { toggleFavoriteService, listFavoritesByUserService, removeFavoriteService } from "@/services/favorite-service";
import { HttpStatus } from "@/shared/http/status-codes";

describe("POST /me/favorites", () => {
    it("deve favoritar produto e retornar 201", async () => {
        (toggleFavoriteService as jest.Mock).mockResolvedValue({
            favorited: true,
            productId: 1,
        });

        const response = await request(app)
            .post("/me/favorites")
            .send({ productId: 1 });

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
            success: true,
            data: { favorited: true, productId: 1 },
        });
    });

    it("deve remover favorito e retornar 200", async () => {
        (toggleFavoriteService as jest.Mock).mockResolvedValue({
            favorited: false,
            productId: 1,
        });

        const response = await request(app)
            .post("/me/favorites")
            .send({ productId: 1 });

        expect(response.status).toBe(HttpStatus.OK);
    });

    it("deve retornar 400 se payload for inválido", async () => {
        const response = await request(app)
            .post("/me/favorites")
            .send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
});


describe("GET /me/favorites", () => {
    it("deve listar favoritos do usuário", async () => {
        (listFavoritesByUserService as jest.Mock).mockResolvedValue([
            { id: 1, name: "Produto A" },
            { id: 2, name: "Produto B" },
        ]);

        const response = await request(app).get("/me/favorites");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
            success: true,
            data: [
                { id: 1, name: "Produto A" },
                { id: 2, name: "Produto B" },
            ],
        });
    });
});

describe("DELETE /me/favorites/:productId", () => {
    it("deve remover favorito", async () => {
        (removeFavoriteService as jest.Mock).mockResolvedValue({ removed: true });

        const response = await request(app)
            .delete("/me/favorites/1");

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
            success: true,
            data: { removed: true },
        });
    });

    it("deve retornar 400 se params forem inválidos", async () => {
        const response = await request(app)
            .delete("/me/favorites/abc");

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
});