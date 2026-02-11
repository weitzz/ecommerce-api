import request from 'supertest'

import app from '@/app';


const api = request(app)
describe("POST /auth/refresh", () => {
    it("should rotate refresh token and return 200", async () => {
        // 1. login
        const loginRes = await api
            .post("/auth/login")
            .send({ email: "joao@email.com", password: "123456" })

        const cookiesHeader = loginRes.headers["set-cookie"]
        expect(cookiesHeader).toBeDefined()

        const cookies = Array.isArray(cookiesHeader)
            ? cookiesHeader
            : [cookiesHeader]

        const oldCookie = cookies.find((c) =>
            c.startsWith("refreshToken=")
        )

        expect(oldCookie).toBeDefined()

        // 2. refresh
        const refreshRes = await api
            .post("/auth/refresh")
            .set("Cookie", oldCookie!)

        expect(refreshRes.status).toBe(200)

        const newCookiesHeader = refreshRes.headers["set-cookie"]
        expect(newCookiesHeader).toBeDefined()

        const newCookies = Array.isArray(newCookiesHeader)
            ? newCookiesHeader
            : [newCookiesHeader]

        const newCookie = newCookies.find((c) =>
            c.startsWith("refreshToken=")
        )

        expect(newCookie).toBeDefined()
        expect(newCookie).not.toEqual(oldCookie)
    })

})