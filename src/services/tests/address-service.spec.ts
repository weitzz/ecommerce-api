import { prisma } from "@/libs/prisma";
import {
    createAddressService,
    getAddressService,
    getAddressByIdService,
    updateAddressService,
    removeAddressService,
} from "@/services/user-service";


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
            delete: jest.fn(),
            update: jest.fn(),
        },
        refreshToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
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


describe("Address", () => {
    beforeEach(() => {
        jest.clearAllMocks();
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


    describe("updateAddressService", () => {
        it("deve atualizar endereço do usuário", async () => {
            const updatedAddress = {
                id: 1,
                zipcode: "98765-432",
                street: "Rua B",
                number: "200",
                city: "Outra Cidade",
                state: "OS",
                country: "Brasil",
                complement: "Casa",
                userId: 1,
            };

            (prisma.userAddress.findFirst as jest.Mock).mockResolvedValue({ id: 1, userId: 1 });
            (prisma.userAddress.update as jest.Mock).mockResolvedValue(updatedAddress);

            const result = await updateAddressService(1, 1, {
                zipcode: "98765-432",
                street: "Rua B",
                number: "200",
                city: "Outra Cidade",
                state: "OS",
                country: "Brasil",
                complement: "Casa",
            });
            expect(result).toEqual({ address: updatedAddress });
        });

        it("deve retornar null se endereço não existir", async () => {
            (prisma.userAddress.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await updateAddressService(1, 999, {
                zipcode: "98765-432",
                street: "Rua B",
                number: "200",
                city: "Outra Cidade",
                state: "OS",
                country: "Brasil",
                complement: "Casa",
            });

            expect(result).toBeNull();
        });
    });

    describe("deleteAddressService", () => {
        it("deve deletar endereço do usuário", async () => {
            (prisma.userAddress.findFirst as jest.Mock).mockResolvedValue({ id: 1, userId: 1 });
            (prisma.userAddress.delete as jest.Mock).mockResolvedValue({ id: 1, userId: 1 });

            const result = await removeAddressService(1, 1);

            expect(result).toBeNull();
        });

        it("deve retornar null se endereço não existir", async () => {
            (prisma.userAddress.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await removeAddressService(1, 999);

            expect(result).toBeNull();
        });
    });

})