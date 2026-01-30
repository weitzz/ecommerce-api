import request from 'supertest';

jest.mock('@/middleware/auth', () => ({
    authMiddleware: (req: any, res: any, next: any) => {
        req.user = { id: 1, email: 'email@email.com' }
        next()
    }
}))


jest.mock('@/services/user-service', () => ({
    createAddressService: jest.fn(),
    getAddressService: jest.fn(),
}))
import app from '@/app';
import * as userService from '@/services/user-service';






const makeAddress = () => ({
    id: 1,
    zipcode: "12345678",
    street: "Rua A",
    number: "123",
    city: "São Paulo",
    state: "SP",
    country: "Brasil",
    complement: null,
})


describe("UserAddressController", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Deve adicionar um endereço com sucesso', async () => {
        jest.spyOn(userService, 'createAddressService').mockResolvedValue((makeAddress() as any))
        const response = await request(app)
            .post('/me/addresses')
            .send({
                zipcode: "12345678",
                street: "Rua A",
                number: "123",
                city: "São Paulo",
                state: "SP",
                country: "Brasil",
            })
        expect(response.status).toBe(201)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    id: 1,
                    zipcode: "12345678",
                    street: "Rua A",
                    number: "123",
                    city: "São Paulo",
                    state: "SP",
                    country: "Brasil",
                    complement: null,
                }),
            })
        )
    })

    it('não deve adicionar endereço com dados inválidos', async () => {
        const response = await request(app)
            .post('/me/addresses')
            .set('Authorization', 'Bearer fake-token')
            .send({
                street: 'Rua A',
            })
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    message: 'Invalid data for address',
                    code: 'VALIDATION_ERROR',
                }),
            })
        )
    })
    it('não deve adicionar endereço se o service falhar', async () => {
        jest
            .spyOn(userService, 'createAddressService')
            .mockResolvedValue(null as any)

        const response = await request(app)
            .post('/me/addresses')
            .send({
                zipcode: "12345678",
                street: "Rua A",
                number: "123",
                city: "São Paulo",
                state: "SP",
                country: "Brasil",
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    message: 'Failed to create address',
                    code: 'ADDRESS_CREATION_FAILED',
                }),
            })
        )
    })
    it('deve chamar o service com o userId do usuário autenticado', async () => {
        const spy = jest
            .spyOn(userService, 'createAddressService')
            .mockResolvedValue(makeAddress() as any)

        await request(app)
            .post('/me/addresses')
            .send({
                zipcode: "12345678",
                street: "Rua A",
                number: "123",
                city: "São Paulo",
                state: "SP",
                country: "Brasil",
            })

        expect(spy).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                zipcode: "12345678",
            })
        )
    })

    it('deve retornar a lista de endereços do usuário', async () => {
        jest
            .spyOn(userService, 'getAddressService')
            .mockResolvedValue([makeAddress()] as any)

        const response = await request(app)
            .get('/me/addresses')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('deve retornar lista vazia quando o usuário não tem endereços', async () => {
        jest
            .spyOn(userService, 'getAddressService')
            .mockResolvedValue([] as any)

        const response = await request(app)
            .get('/me/addresses')

        expect(response.status).toBe(200)
        expect(response.body.data).toEqual([])
    })


})