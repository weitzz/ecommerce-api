import { prisma } from "@/libs/prisma";
import {
    createUserService,
    loginUserService,
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
            (hash as jest.Mock).mockResolvedValue("hashed-refresh");
            (prisma.refreshToken.create as jest.Mock).mockResolvedValue({});
            const result = await loginUserService("JOHN@test.com", "123456");

            expect(result).toEqual({
                user: {
                    id: 1,
                    email: "john@test.com",
                },
                accessToken: "jwt-token",
                refreshToken: "jwt-token",
            });
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



});
