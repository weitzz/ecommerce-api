import z from 'zod';

export const getProductSchema = z.object({
    metadata: z.string().optional(),
    orderBy: z.enum(['views', 'selling', 'price']).optional().default('views'),
    order: z.enum(['asc', 'desc']).default('asc'),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    search: z.string().optional()

});

