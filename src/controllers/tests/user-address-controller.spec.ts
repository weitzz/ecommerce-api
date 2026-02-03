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
    removeAddressService: jest.fn(),
    updateAddressService: jest.fn(),
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

describe("Deletar Endereço", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('deve remover um endereço do usuário', async () => {
        jest
            .spyOn(userService, 'removeAddressService')
            .mockResolvedValue({ removed: true } as any)

        const response = await request(app)
            .delete('/me/addresses/1')

        expect(response.status).toBe(204)
        expect(response.body).toEqual({})
    })

    it('deve retornar 404 ao tentar remover endereço inexistente', async () => {
        jest
            .spyOn(userService, 'removeAddressService')
            .mockResolvedValue(null as any)

        const response = await request(app)
            .delete('/me/addresses/1')

        expect(response.status).toBe(404)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: 'ADDRESS_NOT_FOUND',
                }),
            })
        )
    })
    it('deve retornar 400 se o id do endereço for inválido', async () => {
        const response = await request(app)
            .delete('/me/addresses/abc')

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
    })
})

describe('Atualizar Endereço', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('deve atualizar um endereço do usuário', async () => {
        jest
            .spyOn(userService, 'updateAddressService')
            .mockResolvedValue(makeAddress() as any)

        const response = await request(app)
            .put('/me/addresses/1')
            .send({
                zipcode: "12345678",
                street: "Rua A",
                number: "123",
                city: "São Paulo",
                state: "SP",
                country: "Brasil",
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    id: 1,
                    street: "Rua A",
                }),
            })
        )
    })

    it('deve retornar 404 ao tentar atualizar endereço inexistente', async () => {
        jest
            .spyOn(userService, 'updateAddressService')
            .mockResolvedValue(null as any)

        const response = await request(app)
            .put('/me/addresses/1')
            .send({
                zipcode: "12345678",
                street: "Rua A",
                number: "123",
                city: "São Paulo",
                state: "SP",
                country: "Brasil",
            })

        expect(response.status).toBe(404)
        expect(response.body.error.code).toBe('ADDRESS_NOT_FOUND')
    })
    it('não deve atualizar endereço com dados inválidos', async () => {
        const response = await request(app)
            .put('/me/addresses/1')
            .send({
                street: "Rua A",
            })

        expect(response.status).toBe(400)
        expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })


})
