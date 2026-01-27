import { prisma } from "@/libs/prisma"
import { createOrderService, updateOrderStatusService, getUserOrdersService, getOrderByIdService } from "@/services/order-service"
import { getProductByIdService } from "@/services/products-service"

jest.mock("@/libs/prisma", () => ({
    prisma: {
        order: {
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    },
}));
jest.mock("@/services/products-service", () => ({
    getProductByIdService: jest.fn(),
}));

describe("Order Service", () => {

    const mockAddress = {
        zipcode: "12345-678",
        street: "Rua A",
        number: "100",
        city: "Cidade",
        state: "ST",
        country: "Brasil",
        complement: "Apto 101",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createOrderService", () => {
        it("deve criar pedido e retornar id", async () => {
            (getProductByIdService as jest.Mock).mockResolvedValue({ id: 1, price: 50 });
            (prisma.order.create as jest.Mock).mockResolvedValue({ id: 10 });

            const result = await createOrderService({
                userId: 1,
                cart: [{ productId: 1, quantity: 2 }],
                address: mockAddress,
                shippingCost: 20,
                shippingDays: 5,
            });

            expect(getProductByIdService).toHaveBeenCalledWith(1);
            expect(prisma.order.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        totalPrice: 120, // 50*2 + 20
                    }),
                })
            );
            expect(result).toBe(10);
        });

        it("deve ignorar item se getProductByIdService retornar null", async () => {
            (getProductByIdService as jest.Mock).mockResolvedValue(null);
            (prisma.order.create as jest.Mock).mockResolvedValue({ id: 11 });

            const result = await createOrderService({
                userId: 1,
                cart: [{ productId: 999, quantity: 1 }],
                address: mockAddress,
                shippingCost: 0,
                shippingDays: 3,
            });

            expect(result).toBe(11);
            expect(prisma.order.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        orderProducts: { create: [] },
                    }),
                })
            );
        });

        it("deve retornar null se prisma.order.create não criar pedido", async () => {
            (getProductByIdService as jest.Mock).mockResolvedValue({ id: 1, price: 50 });
            (prisma.order.create as jest.Mock).mockResolvedValue(null);

            const result = await createOrderService({
                userId: 1,
                cart: [{ productId: 1, quantity: 1 }],
                address: mockAddress,
                shippingCost: 10,
                shippingDays: 3,
            });

            expect(result).toBeNull();
        });
    });

    // ---------------- updateOrderStatusService ----------------
    describe("updateOrderStatusService", () => {
        it("deve atualizar status do pedido", async () => {
            (prisma.order.update as jest.Mock).mockResolvedValue({});

            await updateOrderStatusService(1, "paid");

            expect(prisma.order.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { status: "paid" },
            });
        });
    });

    // ---------------- getUserOrdersService ----------------
    describe("getUserOrdersService", () => {
        it("deve retornar pedidos do usuário", async () => {
            const mockOrders = [{ id: 1, totalPrice: 100, status: "paid", createdAt: new Date() }];
            (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

            const result = await getUserOrdersService(1);

            expect(result).toEqual(mockOrders);
            expect(prisma.order.findMany).toHaveBeenCalledWith({
                where: { userId: 1 },
                select: { id: true, totalPrice: true, status: true, createdAt: true },
                orderBy: { createdAt: "desc" },
            });
        });

        it("deve retornar array vazio se não houver pedidos", async () => {
            (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

            const result = await getUserOrdersService(999);

            expect(result).toEqual([]);
        });
    });

    // ---------------- getOrderByIdService ----------------
    describe("getOrderByIdService", () => {
        it("deve retornar pedido com imagem do produto", async () => {
            const mockOrder = {
                id: 1,
                status: "paid",
                totalPrice: 100,
                shippingCost: 10,
                shippingDays: 3,
                shippingCity: "Cidade",
                shippingComplement: null,
                shippingCountry: "Brasil",
                shippingNumber: "100",
                shippingState: "ST",
                shippingStreet: "Rua A",
                shippingZipcode: "12345-678",
                createdAt: new Date(),
                orderProducts: [
                    {
                        id: 10,
                        quantity: 2,
                        price: 50,
                        product: {
                            id: 5,
                            name: "Produto Teste",
                            price: 50,
                            images: [{ imageUrl: "img1.png" }],
                        },
                    },
                ],
            };
            (prisma.order.findFirst as jest.Mock).mockResolvedValue(mockOrder);

            const result = await getOrderByIdService(1, 1);

            expect(result.orderItems[0].product.image).toBe("media/products/img1.png");
            expect(result.orderItems[0].product.images).toBeUndefined();
        });

        it("deve retornar pedido com image=null se não houver imagens", async () => {
            const mockOrder = {
                id: 1,
                status: "paid",
                totalPrice: 100,
                shippingCost: 10,
                shippingDays: 3,
                shippingCity: "Cidade",
                shippingComplement: null,
                shippingCountry: "Brasil",
                shippingNumber: "100",
                shippingState: "ST",
                shippingStreet: "Rua A",
                shippingZipcode: "12345-678",
                createdAt: new Date(),
                orderProducts: [
                    {
                        id: 10,
                        quantity: 2,
                        price: 50,
                        product: {
                            id: 5,
                            name: "Produto Teste",
                            price: 50,
                            images: [],
                        },
                    },
                ],
            };
            (prisma.order.findFirst as jest.Mock).mockResolvedValue(mockOrder);

            const result = await getOrderByIdService(1, 1);

            expect(result.orderItems[0].product.image).toBeNull();
        });

        it("deve retornar null se pedido não existir", async () => {
            (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getOrderByIdService(999, 1);

            expect(result).toBeNull();
        });
    });
});