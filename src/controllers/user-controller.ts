import { RequestHandler } from "express";
import { registerUserSchema } from "@/schemas/register-user-schema";
import { createAddressService, createUserService, getAddressService, loginUserService } from "@/services/user-service";
import { loginUserSchema } from "@/schemas/login-user-schema";
import { addAddressSchema } from "@/schemas/add-address-schema";
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";


export const registerUser: RequestHandler = async (req, res) => {
    const resultRegister = registerUserSchema.safeParse(req.body)

    if (!resultRegister.success) {
        throw new AppError(
            "Invalid data for user registration",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            resultRegister.error.flatten()
        );
    }
    const { name, email, password } = resultRegister.data;

    const user = await createUserService(name, email, password);
    if (!user) {
        throw new AppError(
            "Email already registered",
            "EMAIL_ALREADY_REGISTERED",
            HttpStatus.CONFLICT
        );
    }

    return res.status(HttpStatus.CREATED).json({ success: true, data: user });
}


export const loginUser: RequestHandler = async (req, res) => {
    const result = loginUserSchema.safeParse(req.body)

    if (!result.success) {
        throw new AppError(
            "Invalid data for user login",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        );
    }
    const { email, password } = result.data;

    const token = await loginUserService(email, password);
    if (!token) {
        throw new AppError(
            "Invalid credentials",
            "INVALID_CREDENTIALS",
            HttpStatus.UNAUTHORIZED
        )
    }

    return res.status(HttpStatus.OK).json({ success: true, data: { token } });
}


export const addAddress: RequestHandler = async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        throw new AppError(
            "Access denied",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )
    }
    const result = addAddressSchema.safeParse(req.body)
    if (!result.success) {
        throw new AppError(
            "Invalid data for address",
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST,
            result.error.flatten()
        );
    }

    const address = await createAddressService(userId, result.data);

    if (!address) {
        throw new AppError(
            "Failed to create address",
            "ADDRESS_CREATION_FAILED",
            HttpStatus.BAD_REQUEST,
        );
    }

    return res.status(HttpStatus.CREATED).json({ success: true, data: address });
}



export const getAddresses: RequestHandler = async (req, res) => {
    const userId = req.user?.id

    if (!userId) {
        throw new AppError(
            "Access denied",
            "UNAUTHORIZED",
            HttpStatus.UNAUTHORIZED
        )

    }


    const addresses = await getAddressService(userId)


    return res.status(HttpStatus.OK).json({
        success: true, data: addresses
    });
}