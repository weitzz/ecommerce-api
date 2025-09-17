import z from 'zod';

export const registerUserSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 caracters"),

});