import { getAllBanners } from '@/services/banner-service';
import { getAbsoluteImageUrl } from '@/utils/get-absolute-image-url';
import { RequestHandler } from 'express';


export const getBanners: RequestHandler = async (req, res) => {
    const banners = await getAllBanners();
    const bannersWithAbsoluteImageUrl = banners.map(banner => ({
        ...banner,
        imageUrl: getAbsoluteImageUrl(banner.imageUrl)
    }));
    return res.json({ banners: bannersWithAbsoluteImageUrl });
}