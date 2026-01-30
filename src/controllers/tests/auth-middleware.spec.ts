import request from 'supertest'
import express from 'express'
import { authMiddleware } from '@/middleware/auth'
import { errorHandler } from '@/shared/errors/error-handler'


describe('AuthMiddleware', () => {
    const app = express()
    app.use(authMiddleware)
    app.post(
        '/protected',
        authMiddleware,
        (req, res) => res.status(200).json({ ok: true })
    )
    app.use(errorHandler)


    it('Deve retornar 401 se o cabeçalho de autorização estiver ausente', async () => {
        const response = await request(app)
            .post('/protected')

        expect(response.status).toBe(401)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: 'AUTH_TOKEN_MISSING',
                }),
            })
        )
    })

})
