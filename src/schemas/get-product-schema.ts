import z from 'zod';

export const getProductSchema = z.object({
    metadata: z.string().optional(),
    orderBy: z.enum(['views', 'selling', 'price']).optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    search: z.string().optional()

});