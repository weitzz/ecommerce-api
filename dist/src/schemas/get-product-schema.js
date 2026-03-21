"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.getProductSchema = zod_1.default.object({
    metadata: zod_1.default.string().optional(),
    orderBy: zod_1.default.enum(['views', 'selling', 'price']).optional().default('views'),
    order: zod_1.default.enum(['asc', 'desc']).default('asc'),
    page: zod_1.default.coerce.number().min(1).default(1),
    limit: zod_1.default.coerce.number().min(1).max(50).default(10),
    search: zod_1.default.string().optional()
});
