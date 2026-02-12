import request from 'supertest'
import { hash } from "bcryptjs"
import { prisma } from "@/libs/prisma"
import app from '@/app';



const api = request(app)
describe("POST /auth/refresh", () => {
    beforeEach(async () => {
        await prisma.orderProduct.deleteMany()
        await prisma.order.deleteMany()
        await prisma.favorites.deleteMany()
        await prisma.userAddress.deleteMany()
        await prisma.refreshToken.deleteMany()
        await prisma.user.deleteMany()

        await prisma.user.create({
            data: {
                name: "João",
                email: "joao@email.com",
                password: await hash("123456", 10),
            },
        })
    })

    it("should rotate refresh token and return 200", async () => {
        const loginRes = await api
            .post("/auth/login")
            .send({ email: "joao@email.com", password: "123456" })
        expect(loginRes.status).toBe(200)
        const cookiesHeader = loginRes.headers["set-cookie"]
        expect(cookiesHeader).toBeDefined()

        const cookies = Array.isArray(cookiesHeader)
            ? cookiesHeader
            : [cookiesHeader]

        const oldCookie = cookies.find((c) =>
            c.startsWith("refreshToken=")
        )

        expect(oldCookie).toBeDefined()

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