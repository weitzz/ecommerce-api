"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrontEndUrl = void 0;
const getFrontEndUrl = () => {
    return process.env.FRONT_END_URL || '';
};
exports.getFrontEndUrl = getFrontEndUrl;
