"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddress = exports.deleteAddress = exports.getAddresses = exports.addAddress = exports.profile = exports.loginUser = exports.registerUser = void 0;
const register_user_schema_1 = require("../schemas/register-user-schema");
const user_service_1 = require("../services/user-service");
const login_user_schema_1 = require("../schemas/login-user-schema");
const add_address_schema_1 = require("../schemas/add-address-schema");
const app_error_1 = require("../shared/errors/app-error");
const status_codes_1 = require("../shared/http/status-codes");
const validateSchema_1 = require("./helpers/validateSchema");
const getAuthenticatedUser_1 = require("./helpers/getAuthenticatedUser");
const parsedIdParams_1 = require("./helpers/parsedIdParams");
const cookie_1 = require("../libs/cookie");
const registerUser = async (req, res) => {
    const { name, email, password } = (0, validateSchema_1.validateSchema)(register_user_schema_1.registerUserSchema, req.body, "Dados inválidos para registro de usuário");
    const user = await (0, user_service_1.createUserService)(name, email, password);
    if (!user) {
        throw new app_error_1.AppError("Email já cadastrado", "EMAIL_ALREADY_REGISTERED", status_codes_1.HttpStatus.CONFLICT);
    }
    return res.status(status_codes_1.HttpStatus.CREATED).json({ success: true, data: user });
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = (0, validateSchema_1.validateSchema)(login_user_schema_1.loginUserSchema, req.body, "Dados inválidos para login");
    const result = await (0, user_service_1.loginUserService)(email, password);
    if (!result) {
        throw new app_error_1.AppError("Credenciais inválidas", "INVALID_CREDENTIALS", status_codes_1.HttpStatus.UNAUTHORIZED);
    }
    const { accessToken, refreshToken, user } = result;
    res.cookie("refreshToken", refreshToken, (0, cookie_1.getRefreshCookieOptions)());
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: {
            user,
            accessToken
        }
    });
};
exports.loginUser = loginUser;
const profile = async (req, res) => {
    const { id: userId } = (0, getAuthenticatedUser_1.getAuthenticatedUser)(req);
    const user = await (0, user_service_1.getMeService)(userId);
    if (!user) {
        throw new app_error_1.AppError("Usuário não encontrado", "USER_NOT_FOUND", status_codes_1.HttpStatus.NOT_FOUND);
    }
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: user
    });
};
exports.profile = profile;
const addAddress = async (req, res) => {
    const { id: userId } = (0, getAuthenticatedUser_1.getAuthenticatedUser)(req);
    const body = (0, validateSchema_1.validateSchema)(add_address_schema_1.addAddressSchema, req.body, "Dados inválidos para endereço");
    const address = await (0, user_service_1.createAddressService)(userId, body);
    if (!address) {
        throw new app_error_1.AppError("Erro ao criar endereço", "ADDRESS_CREATION_FAILED", status_codes_1.HttpStatus.BAD_REQUEST);
    }
    return res.status(status_codes_1.HttpStatus.CREATED).json({ success: true, data: address });
};
exports.addAddress = addAddress;
const getAddresses = async (req, res) => {
    const { id: userId } = (0, getAuthenticatedUser_1.getAuthenticatedUser)(req);
    const addresses = await (0, user_service_1.getAddressService)(userId);
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true, data: addresses
    });
};
exports.getAddresses = getAddresses;
const deleteAddress = async (req, res) => {
    const { id: userId } = (0, getAuthenticatedUser_1.getAuthenticatedUser)(req);
    const addressId = (0, parsedIdParams_1.parseIdParam)(req.params.id, "Endereço");
    const result = await (0, user_service_1.removeAddressService)(userId, addressId);
    if (!result) {
        throw new app_error_1.AppError("Endereço não encontrado", "ADDRESS_NOT_FOUND", status_codes_1.HttpStatus.NOT_FOUND);
    }
    return res.status(status_codes_1.HttpStatus.NO_CONTENT).send();
};
exports.deleteAddress = deleteAddress;
const updateAddress = async (req, res) => {
    const { id: userId } = (0, getAuthenticatedUser_1.getAuthenticatedUser)(req);
    const addressId = (0, parsedIdParams_1.parseIdParam)(req.params.id, "Endereço");
    const body = (0, validateSchema_1.validateSchema)(add_address_schema_1.addAddressSchema, req.body, "Dados inválidos para endereço");
    const updated = await (0, user_service_1.updateAddressService)(userId, addressId, body);
    if (!updated) {
        throw new app_error_1.AppError("Endereço não encontrado", "ADDRESS_NOT_FOUND", status_codes_1.HttpStatus.NOT_FOUND);
    }
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: updated,
    });
};
exports.updateAddress = updateAddress;
