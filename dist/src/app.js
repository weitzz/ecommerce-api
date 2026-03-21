"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const error_handler_1 = require("./shared/errors/error-handler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
const app = (0, express_1.default)();
const allowedOrigins = (process.env.FRONT_END_URL || "http://localhost:3000")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerConfig));
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origin não permitida pelo CORS"));
    },
    credentials: true
}));
app.use("/webhook/stripe", express_1.default.raw({ type: "application/json" }));
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use(routes_1.routes);
app.use(error_handler_1.errorHandler);
exports.default = app;
