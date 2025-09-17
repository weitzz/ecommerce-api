import { RequestHandler } from "express";
import { registerUserSchema } from "@/schemas/register-user-schema";
import { createUserService } from "@/services/user-service";


export const registerUser: RequestHandler = async (req, res) => {
    const resultRegister = registerUserSchema.safeParse(req.body)

    if (!resultRegister.success) {
        return res.status(400).json({ error: "Invalid data for user registration" });

    }
    const { name, email, password } = resultRegister.data;

    const user = await createUserService(name, email, password);
    if (!user) {
        return res.status(400).json({ error: "Email already registered" })
    }

    res.status(201).json({ error: null, message: "User registered successfully", user });
}