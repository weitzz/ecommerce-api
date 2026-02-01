import z from 'zod';

export const registerUserSchema = z.object({
    name: z.string({ error: issue => issue.input === undefined ? "Nome é obrigatório" : "Nome inválido" }).min(3, "Nome é obrigatório"),
    email: z.email({ error: issue => issue.input === undefined ? "Email é obrigatório" : "Email inválido" }),
    password: z.string({ error: issue => issue.input === undefined ? "Senha é obrigatória, mínimo 6 caracteres" : "Senha inválida" }).min(6, "Senha deve ter no mínimo 6 caracteres"),

});

