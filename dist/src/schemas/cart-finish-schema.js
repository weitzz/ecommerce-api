"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartFinishSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.cartFinishSchema = zod_1.default.object({
    addressId: zod_1.default.number().int(),
    cart: zod_1.default.array(zod_1.default.object({
        productId: zod_1.default.number().int(),
        quantity: zod_1.default.number().int().min(1),
    })).nonempty()
});
