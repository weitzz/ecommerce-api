"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    req.user = { id: 1 };
    next();
};
exports.authMiddleware = authMiddleware;
