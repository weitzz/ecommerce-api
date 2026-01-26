import z from 'zod';

export const addAddressSchema = z.object({
    zipcode: z.string().min(5, 'CEP inválido'),
    street: z.string().min(1, 'Rua obrigatória'),
    number: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    state: z.string().length(2, 'Estado inválido'),
    country: z.string().min(1, "País obrigatório"),
    complement: z.string().nullable().optional(),

});