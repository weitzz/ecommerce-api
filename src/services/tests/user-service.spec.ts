import { prisma } from "../../libs/prisma";
import {
    createUserService,
    loginUserService,
    GetUserByIdTokenService,
    createAddressService,
    getAddressService,
    getAddressByIdService,
} from "../user-service";
import { compare, hash } from "bcryptjs";
import { v4 } from "uuid";

jest.mock("../../libs/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        userAddress: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    },
}));

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(),
}));

describe("User Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe("createUserService", () => {
        it("deve criar usuário com sucesso", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (hash as jest.Mock).mockResolvedValue("hashedPassword");
            (prisma.user.create as jest.Mock).mockResolvedValue({
                id: 1,
                name: "John",
                email: "john@test.com",
                password: "hashedPassword",
            });

            const result = await createUserService("John", "john@test.com", "123456");

            expect(result).toEqual({ id: 1, name: "John", email: "john@test.com" });
            expect(prisma.user.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { name: "John", email: "john@test.com", password: "hashedPassword" },
                })
            );
        });

        it("deve retornar null se email já existir", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

            const result = await createUserService("John", "john@test.com", "123456");

            expect(result).toBeNull();
        });

        it("deve retornar null se prisma.user.create falhar", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (hash as jest.Mock).mockResolvedValue("hashedPassword");
            (prisma.user.create as jest.Mock).mockResolvedValue(null);

            const result = await createUserService("John", "john@test.com", "123456");

            expect(result).toBeNull();
        });
    });


    describe("loginUserService", () => {
        it("deve retornar token se login bem-sucedido", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                password: "hashedPassword",
            });
            (compare as jest.Mock).mockResolvedValue(true);
            (v4 as jest.Mock).mockReturnValue("token-123");

            const result = await loginUserService("john@test.com", "123456");

            expect(result).toBe("token-123");
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { token: "token-123" },
            });
        });

        it("deve retornar null se usuário não existir", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await loginUserService("john@test.com", "123456");

            expect(result).toBeNull();
        });

        it("deve retornar null se senha inválida", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, password: "hashedPassword" });
            (compare as jest.Mock).mockResolvedValue(false);

            const result = await loginUserService("john@test.com", "wrongpass");

            expect(result).toBeNull();
        });
    });


    describe("GetUserByIdTokenService", () => {
        it("deve retornar id do usuário se token válido", async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

            const result = await GetUserByIdTokenService("token-123");

            expect(result).toBe(1);
        });

        it("deve retornar null se token inválido", async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await GetUserByIdTokenService("invalid-token");

            expect(result).toBeNull();
        });
    });


    describe("createAddressService", () => {
        it("deve criar endereço para usuário", async () => {
            const address = {
                zipcode: "12345-678",
                street: "Rua A",
                number: "100",
                city: "Cidade",
                state: "ST",
                country: "Brasil",
                complement: "Apto 101",
            };

            (prisma.userAddress.create as jest.Mock).mockResolvedValue({ id: 1, ...address, userId: 1 });

            const result = await createAddressService(1, address);

            expect(result).toEqual({ id: 1, ...address, userId: 1 });
        });
    });


    describe("getAddressService", () => {
        it("deve retornar lista de endereços do usuário", async () => {
            const addresses = [
                { id: 1, zipcode: "123", street: "Rua A", number: "100", city: "Cidade", state: "ST", country: "BR", complement: "Apto" },
            ];
            (prisma.userAddress.findMany as jest.Mock).mockResolvedValue(addresses);

            const result = await getAddressService(1);

            expect(result).toEqual(addresses);
        });
    });


    describe("getAddressByIdService", () => {
        it("deve retornar endereço específico do usuário", async () => {
            const address = { id: 1, zipcode: "123", street: "Rua A", number: "100", city: "Cidade", state: "ST", country: "BR", complement: "Apto" };
            (prisma.userAddress.findFirst as jest.Mock).mockResolvedValue(address);

            const result = await getAddressByIdService(1, 1);

            expect(result).toEqual(address);
        });

        it("deve retornar null se endereço não existir", async () => {
            (prisma.userAddress.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getAddressByIdService(1, 999);

            expect(result).toBeNull();
        });
    });
});
