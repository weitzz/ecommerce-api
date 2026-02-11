import request from 'supertest';

jest.mock('@/middleware/auth', () => ({
    authMiddleware: (req: any, res: any, next: any) => next()
}))

jest.mock('@/services/user-service', () => ({
    loginUserService: jest.fn(),
}))


import app from '@/app';
import * as  loginService from "../../services/user-service"

describe("LoginUserController", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('Deve logar um usuário com sucesso', async () => {
        jest.spyOn(loginService, 'loginUserService').mockResolvedValueOnce({
            user: {
                id: 1,
                name: "Test User",
                email: "email@email.com",
            },
            accessToken: "access-token",
            refreshToken: "refresh-token",
        })

        const response = await request(app).post('/auth/login').send({
            email: "email@email.com",
            password: "123456"
        })
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                success: true,
                data: {
                    user: {
                        id: 1,
                        name: "Test User",
                        email: "email@email.com",
                    },
                    accessToken: "access-token",
                }
            })
        )
        const cookies = response.headers["set-cookie"]
        expect(cookies).toBeDefined()
        expect(cookies[0]).toContain("refreshToken=")
        expect(cookies[0]).toContain("HttpOnly")
    });
    it('Não deve permitir login com body inválido', async () => {
        const response = await request(app).post('/auth/login').send({
            email: "email@email.com",
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: 'VALIDATION_ERROR',
                })
            })
        )
    })

    it('Não deve permitir login com credenciais inválidas', async () => {
        jest.spyOn(loginService, 'loginUserService').mockResolvedValue(null)

        const response = await request(app).post('/auth/login')
            .send({
                email: 'email@email.com',
                password: 'senha-errada',
            })


        expect(response.status).toBe(401)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: 'INVALID_CREDENTIALS',
                })
            })
        )
    })
})
