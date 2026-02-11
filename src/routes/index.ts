import { Router } from 'express'
import authRoutes from './auth.routes'
import bannerRoutes from './banner.routes'
import cartRoutes from './cart.routes'
import categoryRoutes from './category.routes'
import orderRoutes from './order.routes'
import productRoutes from './product.routes'
import userRoutes from './user.routes'
import webhookRoutes from './webhook.routes'


const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/banners', bannerRoutes)
routes.use('/cart', cartRoutes)
routes.use('/categories', categoryRoutes)
routes.use('/orders', orderRoutes)
routes.use('/products', productRoutes)
routes.use('/me', userRoutes)
routes.use('/webhook', webhookRoutes)

export { routes }