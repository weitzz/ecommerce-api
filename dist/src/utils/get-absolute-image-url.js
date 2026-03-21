"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsoluteImageUrl = void 0;
const get_base_url_1 = require("./get-base-url");
const getAbsoluteImageUrl = (path) => {
    return `${(0, get_base_url_1.getBaseUrl)()}${path}`;
};
exports.getAbsoluteImageUrl = getAbsoluteImageUrl;
