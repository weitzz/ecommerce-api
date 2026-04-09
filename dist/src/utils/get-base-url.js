"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = getBaseUrl;
function getBaseUrl() {
    if (process.env.APP_URL) {
        return process.env.APP_URL;
    }
    if (process.env.NODE_ENV !== 'production') {
        return `http://localhost:${process.env.PORT || 4000}`;
    }
    return '';
}
