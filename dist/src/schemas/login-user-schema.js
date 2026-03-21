"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginUserSchema = zod_1.default.object({
    email: zod_1.default.email({ error: issue => issue.input === undefined ? "Email é obrigatório" : "Email inválido" }),
    password: zod_1.default.string({ error: issue => issue.input === undefined ? "Senha é obrigatória, mínimo 6 caracteres" : "Senha inválida" }).min(6, "Senha deve ter no mínimo 6 caracteres"),
});
