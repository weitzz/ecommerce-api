import { RequestHandler } from "express";
import { registerUserSchema } from "@/schemas/register-user-schema";
import { createAddressService, createUserService, getAddressService, getMeService, loginUserService, removeAddressService, updateAddressService } from "@/services/user-service";
import { loginUserSchema } from "@/schemas/login-user-schema";
import { addAddressSchema } from "@/schemas/add-address-schema";
import { AppError } from "@/shared/errors/app-error";
import { HttpStatus } from "@/shared/http/status-codes";
import { validateSchema } from "./helpers/validateSchema";
import { getAuthenticatedUser } from "./helpers/getAuthenticatedUser";
import { parseIdParam } from "./helpers/parsedIdParams";



export const registerUser: RequestHandler = async (req, res) => {
    const { name, email, password } = validateSchema(
        registerUserSchema,
        req.body,
        "Dados inválidos para registro de usuário")


    const user = await createUserService(name, email, password);
    if (!user) {
        throw new AppError(
            "Email já cadastrado",
            "EMAIL_ALREADY_REGISTERED",
            HttpStatus.CONFLICT
        );
    }

    return res.status(HttpStatus.CREATED).json({ success: true, data: user });
}


export const loginUser: RequestHandler = async (req, res) => {
    const { email, password } = validateSchema(
        loginUserSchema,
        req.body,
        "Dados inválidos para login"
    );


    const result = await loginUserService(email, password);
    if (!result) {
        throw new AppError(
            "Credenciais inválidas",
            "INVALID_CREDENTIALS",
            HttpStatus.UNAUTHORIZED
        )
    }
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/refresh",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    return res.status(HttpStatus.OK).json({
        success: true, data: {
            user: result.user,
            accessToken: result.accessToken
        }
    });
}

export const profile: RequestHandler = async (req, res) => {
    const { id: userId } = getAuthenticatedUser(req)
    const user = await getMeService(userId)

    if (!user) {
        throw new AppError(
            "Usuário não encontrado",
            "USER_NOT_FOUND",
            HttpStatus.NOT_FOUND
        )
    }

    return res.status(HttpStatus.OK).json({
        success: true,
        data: user
    })
}

export const addAddress: RequestHandler = async (req, res) => {
    const { id: userId } = getAuthenticatedUser(req);

    const body = validateSchema(
        addAddressSchema,
        req.body,
        "Dados inválidos para endereço"
    );

    const address = await createAddressService(userId, body);

    if (!address) {
        throw new AppError(
            "Erro ao criar endereço",
            "ADDRESS_CREATION_FAILED",
            HttpStatus.BAD_REQUEST,
        );
    }

    return res.status(HttpStatus.CREATED).json({ success: true, data: address });
}



export const getAddresses: RequestHandler = async (req, res) => {
    const { id: userId } = getAuthenticatedUser(req);

    const addresses = await getAddressService(userId)

    return res.status(HttpStatus.OK).json({
        success: true, data: addresses
    });
}


export const deleteAddress: RequestHandler = async (req, res) => {
    const { id: userId } = getAuthenticatedUser(req);

    const addressId = parseIdParam(req.params.id, "Endereço");

    const result = await removeAddressService(userId, addressId);

    if (!result) {
        throw new AppError(
            "Endereço não encontrado",
            "ADDRESS_NOT_FOUND",
            HttpStatus.NOT_FOUND
        );
    }

    return res.status(HttpStatus.NO_CONTENT).send();
}

export const updateAddress: RequestHandler = async (req, res) => {
    const { id: userId } = getAuthenticatedUser(req);
    const addressId = parseIdParam(req.params.id, "Endereço");
    const body = validateSchema(
        addAddressSchema,
        req.body,
        "Dados inválidos para endereço"
    );

    const updated = await updateAddressService(userId, addressId, body)

    if (!updated) {
        throw new AppError(
            "Endereço não encontrado",
            "ADDRESS_NOT_FOUND",
            HttpStatus.NOT_FOUND
        );
    }

    return res.status(HttpStatus.OK).json({
        success: true,
        data: updated,
    });

}