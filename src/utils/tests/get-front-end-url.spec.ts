describe("getFrontEndUrl", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
        delete process.env.FRONT_END_URL;
        delete process.env.FRONTEND_URL;
        delete process.env.NEXT_PUBLIC_FRONT_END_URL;
        delete process.env.NEXT_PUBLIC_APP_URL;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("deve usar FRONT_END_URL sem barra final", async () => {
        process.env.FRONT_END_URL = "https://frontend.example.com/";

        const { getFrontEndUrl } = await import("@/utils/get-front-end-url");

        expect(getFrontEndUrl()).toBe("https://frontend.example.com");
    });

    it("deve usar fallback local fora de produção", async () => {
        process.env.NODE_ENV = "test";

        const { getFrontEndUrl } = await import("@/utils/get-front-end-url");

        expect(getFrontEndUrl()).toBe("http://localhost:3000");
    });

    it("deve lançar erro em produção sem URL configurada", async () => {
        process.env.NODE_ENV = "production";

        const { getFrontEndUrl } = await import("@/utils/get-front-end-url");

        expect(() => getFrontEndUrl()).toThrow(
            "Front-end URL is not configured. Set FRONT_END_URL in production."
        );
    });
});
