"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressService = exports.removeAddressService = exports.getAddressByIdService = exports.getAddressService = exports.createAddressService = exports.getMeService = exports.loginUserService = exports.createUserService = void 0;
const prisma_1 = require("../libs/prisma");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserService = async (name, email, password) => {
    const normalizedEmail = email.toLowerCase();
    const existingEmail = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingEmail)
        return null;
    const hashPassword = await (0, bcryptjs_1.hash)(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashPassword
        }
    });
    if (!user)
        return null;
    return {
        id: user.id, name: user.name, email: user.email
    };
};
exports.createUserService = createUserService;
const loginUserService = async (email, password) => {
    const normalizedEmail = email.toLowerCase();
    const user = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user)
        return null;
    const validPassword = await (0, bcryptjs_1.compare)(password, user.password);
    if (!validPassword)
        return null;
    const accessToken = jsonwebtoken_1.default.sign({ sub: String(user.id) }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const jti = (0, crypto_1.randomBytes)(16).toString("hex");
    const refreshToken = jsonwebtoken_1.default.sign({
        sub: String(user.id),
        jti,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    const refreshTokenHash = await (0, bcryptjs_1.hash)(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma_1.prisma.refreshToken.create({
        data: {
            jti,
            tokenHash: refreshTokenHash,
            expiresAt,
            user: {
                connect: { id: user.id }
            }
        }
    });
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken
    };
};
exports.loginUserService = loginUserService;
const getMeService = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true
        }
    });
    return user;
};
exports.getMeService = getMeService;
const createAddressService = async (userId, input) => {
    const data = {
        zipcode: input.zipcode.trim(),
        street: input.street.trim(),
        number: input.number.trim(),
        city: input.city.trim(),
        state: input.state.trim(),
        country: input.country.trim(),
        complement: input.complement?.trim() || null,
        userId,
    };
    return prisma_1.prisma.userAddress.create({ data });
};
exports.createAddressService = createAddressService;
const getAddressService = async (userId) => {
    return await prisma_1.prisma.userAddress.findMany({
        where: { userId },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true
        }
    });
};
exports.getAddressService = getAddressService;
const getAddressByIdService = async (userId, addressId) => {
    return await prisma_1.prisma.userAddress.findFirst({
        where: { id: addressId, userId },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true
        }
    });
};
exports.getAddressByIdService = getAddressByIdService;
const removeAddressService = async (userId, addressId) => {
    const address = await prisma_1.prisma.userAddress.findFirst({
        where: {
            id: addressId, userId
        },
    });
    if (!address) {
        return null;
    }
    await prisma_1.prisma.userAddress.delete({
        where: {
            id: addressId
        },
    });
    return null;
};
exports.removeAddressService = removeAddressService;
const updateAddressService = async (userId, addressId, input) => {
    const address = await prisma_1.prisma.userAddress.findFirst({
        where: {
            id: addressId, userId
        },
    });
    if (!address) {
        return null;
    }
    const data = {
        zipcode: input.zipcode.trim(),
        street: input.street.trim(),
        number: input.number.trim(),
        city: input.city.trim(),
        state: input.state.trim(),
        country: input.country.trim(),
        complement: input.complement?.trim() || null,
    };
    const updateAddress = await prisma_1.prisma.userAddress.update({
        where: {
            id: addressId
        },
        data
    });
    return { address: updateAddress };
};
exports.updateAddressService = updateAddressService;
