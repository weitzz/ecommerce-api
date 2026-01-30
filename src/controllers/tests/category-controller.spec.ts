import request from 'supertest'

jest.mock('@/services/category-service', () => ({
    getCategoryBySlugService: jest.fn(),
    getCategoryMetadataService: jest.fn(),
}))

import app from '@/app'
import * as categoryService from '@/services/category-service'

describe('CategoryController', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('deve retornar categoria com metadata com sucesso', async () => {
        jest
            .spyOn(categoryService, 'getCategoryBySlugService')
            .mockResolvedValue({
                id: 1,
                name: 'Tecnologia',
                slug: 'tech',
            } as any)

        jest
            .spyOn(categoryService, 'getCategoryMetadataService')
            .mockResolvedValue([
                {
                    id: 10,
                    name: 'Camisas',
                    values: [
                        { id: 1, label: 'React' },
                        { id: 2, label: 'Node' },
                    ],
                },
            ] as any)

        const response = await request(app)
            .get('/categories/tech/metadata')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                success: true,
                data: {
                    category: {
                        id: 1,
                        name: 'Tecnologia',
                        slug: 'tech',
                    },
                    metadata: expect.any(Array),
                },
            })
        )
    })

    it('deve retornar 404 se categoria não existir', async () => {
        jest
            .spyOn(categoryService, 'getCategoryBySlugService')
            .mockResolvedValue(null)

        const response = await request(app)
            .get('/categories/categoria-inexistente/metadata')
        expect(response.status).toBe(404)
        expect(response.body).toMatchObject({
            success: false,
            error: {
                code: 'CATEGORY_NOT_FOUND',
                message: 'Category not found',
            },
        })
    })
})
