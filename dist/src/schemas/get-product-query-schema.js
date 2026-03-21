"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.getProductsQuerySchema = zod_1.default.object({
    limit: zod_1.default.string().regex(/^\d+$/).optional(),
});
