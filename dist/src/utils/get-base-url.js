"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = void 0;
const getBaseUrl = () => {
    return (process.env.API_URL || process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`);
};
exports.getBaseUrl = getBaseUrl;
