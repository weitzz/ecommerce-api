import z from 'zod';

export const addAddressSchema = z.object({
    zipcode: z.string({ error: issue => issue.input === undefined ? "CEP é obrigatório" : "CEP inválido" }).regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    street: z.string({ error: issue => issue.input === undefined ? "Rua é obrigatória" : "Rua inválida" }).min(1, 'Rua obrigatória'),
    number: z.string({ error: issue => issue.input === undefined ? "Número é obrigatório" : "Número inválido" }).min(1, 'Número obrigatório'),
    city: z.string({ error: issue => issue.input === undefined ? "Cidade é obrigatória" : "Cidade inválida" }).min(1, 'Cidade obrigatória'),
    state: z.string({ error: issue => issue.input === undefined ? "Estado é obrigatório" : "Estado inválido" }).length(2, 'Estado inválido'),
    country: z.string({ error: issue => issue.input === undefined ? "País é obrigatório" : "País inválido" }).min(1, "País obrigatório"),
    complement: z.string().nullable().optional(),

});