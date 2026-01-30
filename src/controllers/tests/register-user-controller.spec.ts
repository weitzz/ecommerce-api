import request from 'supertest';

jest.mock('@/services/user-service', () => ({
    createUserService: jest.fn(),
}))

import app from '@/app';

import * as  createService from "@/services/user-service";



describe("CreateUserController", () => {

    it('Deve criar um usuário com sucesso', async () => {
        jest
            .spyOn(createService, 'createUserService')
            .mockResolvedValue({
                id: 1,
                name: 'Teste',
                email: 'email@email.com',
            } as any)

        const response = await request(app).post('/auth/register').send({
            name: "Teste",
            email: "email@email.com",
            password: "123456",
        })
        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    id: expect.any(Number),
                    name: "Teste",
                    email: "email@email.com",
                })
            })
        )
    });

    it('Não deve criar um usuário com email já existente', async () => {
        jest
            .spyOn(createService, 'createUserService')
            .mockResolvedValue(null)
        const response = await request(app).post('/auth/register').send({
            name: "Teste",
            email: "email@email.com",
            password: "123456"
        })
        expect(response.status).toBe(409);
        expect(response.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: 'EMAIL_ALREADY_REGISTERED',
                })
            })
        )
    })
})


