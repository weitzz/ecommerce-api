import z from 'zod';

export const getProductsQuerySchema = z.object({

    limit: z.string().regex(/^\d+$/).optional(),

});

