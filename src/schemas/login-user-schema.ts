import z from 'zod';

export const loginUserSchema = z.object({
    email: z.email({ error: issue => issue.input === undefined ? "Email é obrigatório" : "Email inválido" }),
    password: z.string({ error: issue => issue.input === undefined ? "Senha é obrigatória, mínimo 6 caracteres" : "Senha inválida" }).min(6, "Senha deve ter no mínimo 6 caracteres"),

});