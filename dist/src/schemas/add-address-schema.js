"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAddressSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.addAddressSchema = zod_1.default.object({
    zipcode: zod_1.default.string({ error: issue => issue.input === undefined ? "CEP é obrigatório" : "CEP inválido" }).regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    street: zod_1.default.string({ error: issue => issue.input === undefined ? "Rua é obrigatória" : "Rua inválida" }).min(1, 'Rua obrigatória'),
    number: zod_1.default.string({ error: issue => issue.input === undefined ? "Número é obrigatório" : "Número inválido" }).min(1, 'Número obrigatório'),
    city: zod_1.default.string({ error: issue => issue.input === undefined ? "Cidade é obrigatória" : "Cidade inválida" }).min(1, 'Cidade obrigatória'),
    state: zod_1.default.string({ error: issue => issue.input === undefined ? "Estado é obrigatório" : "Estado inválido" }).length(2, 'Estado inválido'),
    country: zod_1.default.string({ error: issue => issue.input === undefined ? "País é obrigatório" : "País inválido" }).min(1, "País obrigatório"),
    complement: zod_1.default.string().nullable().optional(),
});
