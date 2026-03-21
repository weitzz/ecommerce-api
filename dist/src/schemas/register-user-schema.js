"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerUserSchema = zod_1.default.object({
    name: zod_1.default.string({ error: issue => issue.input === undefined ? "Nome é obrigatório" : "Nome inválido" }).min(3, "Nome é obrigatório"),
    email: zod_1.default.email({ error: issue => issue.input === undefined ? "Email é obrigatório" : "Email inválido" }),
    password: zod_1.default.string({ error: issue => issue.input === undefined ? "Senha é obrigatória, mínimo 6 caracteres" : "Senha inválida" }).min(6, "Senha deve ter no mínimo 6 caracteres"),
});
