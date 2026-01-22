import { z } from "zod";

export const FavoriteSchema = z.object({
    productId: z.number().int().positive(),
});

