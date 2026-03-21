"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBanners = void 0;
const banner_service_1 = require("../services/banner-service");
const get_absolute_image_url_1 = require("../utils/get-absolute-image-url");
const status_codes_1 = require("../shared/http/status-codes");
const getBanners = async (req, res) => {
    const banners = await (0, banner_service_1.getAllBannersService)();
    const bannersWithAbsoluteImageUrl = banners.map(banner => ({
        ...banner,
        imageUrl: (0, get_absolute_image_url_1.getAbsoluteImageUrl)(banner.imageUrl)
    }));
    return res.status(status_codes_1.HttpStatus.OK).json({
        success: true,
        data: bannersWithAbsoluteImageUrl
    });
};
exports.getBanners = getBanners;
