"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = void 0;
const getBaseUrl = () => {
    const baseUrl = process.env.API_URL ?? process.env.BASE_URL;
    if (!baseUrl) {
        console.warn("⚠️ API_URL/BASE_URL não definida, usando localhost");
    }
    return baseUrl ?? `http://localhost:${process.env.PORT || "4444"}`;
};
exports.getBaseUrl = getBaseUrl;
