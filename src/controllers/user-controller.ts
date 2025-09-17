import { RequestHandler } from "express";
import { registerUserSchema } from "@/schemas/register-user-schema";
import { createUserService, loginUserService } from "@/services/user-service";
import { loginUserSchema } from "@/schemas/login-user-schema";


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


export const loginUser: RequestHandler = async (req, res) => {
    const resultLogin = loginUserSchema.safeParse(req.body)

    if (!resultLogin.success) {
        return res.status(400).json({ error: "Invalid data" });

    }
    const { email, password } = resultLogin.data;

    const token = await loginUserService(email, password);
    if (!token) {
        return res.status(401).json({ error: "Access denied" })
    }

    res.json({ error: null, token });
}