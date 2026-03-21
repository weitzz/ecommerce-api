"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteParamsSchema = exports.FavoriteSchema = void 0;
const zod_1 = require("zod");
exports.FavoriteSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(),
});
exports.FavoriteParamsSchema = zod_1.z.object({
    productId: zod_1.z.coerce.number(),
});
