import { prisma } from "@/libs/prisma";
import {
    createUserService,
    loginUserService,
    createAddressService,
    getAddressService,
    getAddressByIdService,
} from "@/services/user-service";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken"

jest.mock("@/libs/prisma", () => ({
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

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn()
}))

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
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
        it("deve retornar token JWT se login bem-sucedido", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                email: "john@test.com",
                password: "hashedPassword",
            });

            (compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

            const result = await loginUserService("JOHN@test.com", "123456");

            expect(result).toBe("jwt-token");

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: "john@test.com" }
            });

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1, email: "john@test.com" },
                process.env.JWT_SECRET,
                { expiresIn: "3d" }
            );
        });





        it("deve retornar null se usuário não existir", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await loginUserService("john@test.com", "123456");

            expect(result).toBeNull();
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it("deve retornar null se senha inválida", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: "john@test.com", password: "hashedPassword" });
            (compare as jest.Mock).mockResolvedValue(false);

            const result = await loginUserService("john@test.com", "wrongpass");

            expect(result).toBeNull();
            expect(jwt.sign).not.toHaveBeenCalled();
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
