import { getAllBannersService } from '@/services/banner-service';
import { getAbsoluteImageUrl } from '@/utils/get-absolute-image-url';
import { RequestHandler } from 'express';
import { HttpStatus } from '@/shared/http/status-codes';
import { success } from 'zod';


export const getBanners: RequestHandler = async (req, res) => {
    const banners = await getAllBannersService();
    const bannersWithAbsoluteImageUrl = banners.map(banner => ({
        ...banner,
        imageUrl: getAbsoluteImageUrl(banner.imageUrl)
    }));
    return res.status(HttpStatus.OK).json({
        success: true,
        data: bannersWithAbsoluteImageUrl
    });
}