import request from "supertest"
import app from "@/app"
import * as logoutService from "@/services/auth/logout-service"

jest.mock("@/services/auth/logout-service", () => ({
    logoutService: jest.fn(),
}))

describe("POST /auth/logout", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("deve fazer logout com sucesso quando refresh token existe", async () => {
        const spy = jest
            .spyOn(logoutService, "logoutService")
            .mockResolvedValueOnce(undefined)

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=fake-refresh-token; Path=/auth/refresh"
            )

        expect(response.status).toBe(204)

        expect(spy).toHaveBeenCalledWith("fake-refresh-token")

        const cookies = response.headers["set-cookie"]
        expect(cookies).toBeDefined()
        expect(cookies[0]).toContain("refreshToken=")
        expect(cookies[0]).toContain("Path=/auth/refresh")
        expect(cookies[0]).toContain("Expires=")
    })

    it("deve retornar 204 mesmo sem refresh token", async () => {
        const response = await request(app).post("/auth/logout")

        expect(response.status).toBe(204)
        expect(logoutService.logoutService).not.toHaveBeenCalled()
    })
})
