import request from 'supertest';
jest.mock('@/services/products-service', () => ({
    getAllProductsService: jest.fn(),
    getProductByIdService: jest.fn(),
    incrementProductViewsService: jest.fn(),
    getProductsFromSameCategoryService: jest.fn(),
}))

jest.mock('@/services/category-service', () => ({
    getCategoryService: jest.fn(),
}))

jest.mock('@/utils/get-absolute-image-url', () => ({
    getAbsoluteImageUrl: jest.fn((path: string) => `ABS:${path}`)
}))


import app from '@/app';
import * as productsService from '@/services/products-service';
import * as categoryService from '@/services/category-service';

describe('GET /products', () => {
    it('deve retornar produtos com sucesso', async () => {
        jest
            .spyOn(productsService, 'getAllProductsService')
            .mockResolvedValue({
                data: [
                    {
                        id: 1,
                        name: 'Produto',
                        price: 10,
                        image: '/media/products/img.png',
                    }
                ],
                meta: { page: 1, limit: 12, total: 1, totalPages: 1 }
            } as any)

        const response = await request(app).get('/products')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data[0].image).toBe('ABS:/media/products/img.png')
    })

    it('deve retornar erro se metadata for inválido', async () => {
        const response = await request(app)
            .get('/products')
            .query({ metadata: '{invalid-json' })

        expect(response.status).toBe(400)
        expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })
})


describe('GET /products/:id', () => {
    it('deve retornar produto por id', async () => {
        jest
            .spyOn(productsService, 'getProductByIdService')
            .mockResolvedValue({
                id: 1,
                name: 'Produto',
                description: 'Desc',
                price: 10,
                categoryId: 2,
                images: ['/media/products/img.png']
            } as any)

        jest
            .spyOn(categoryService, 'getCategoryService')
            .mockResolvedValue({ id: 2, name: 'Categoria' } as any)

        const response = await request(app).get('/products/1')

        expect(response.status).toBe(200)
        expect(response.body.data.product.images[0])
            .toBe('ABS:/media/products/img.png')

        expect(productsService.incrementProductViewsService)
            .toHaveBeenCalledWith(1)
    })

    it('deve retornar 404 se produto não existir', async () => {
        jest
            .spyOn(productsService, 'getProductByIdService')
            .mockResolvedValue(null)

        const response = await request(app).get('/products/999')

        expect(response.status).toBe(404)
        expect(response.body.error.code).toBe('PRODUCT_NOT_FOUND')
    })
})

describe('GET /products/:id/related', () => {
    it('deve retornar produtos relacionados', async () => {
        jest
            .spyOn(productsService, 'getProductsFromSameCategoryService')
            .mockResolvedValue([
                {
                    id: 2,
                    name: 'Relacionado',
                    price: 20,
                    image: '/media/products/img2.png'
                }
            ] as any)

        const response = await request(app)
            .get('/products/1/related')
            .query({ limit: 4 })

        expect(response.status).toBe(200)
        expect(response.body.data[0].image)
            .toBe('ABS:/media/products/img2.png')
    })
})
