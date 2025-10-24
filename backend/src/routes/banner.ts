import { Router } from 'express';
import { BannerController } from '../controllers/bannerController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const bannerRouter = Router();

bannerRouter.get('/', BannerController.getAll);
bannerRouter.get('/:id', BannerController.getById);
bannerRouter.post('/', authMiddleware, adminMiddleware, BannerController.create);
bannerRouter.put('/:id', authMiddleware, adminMiddleware, BannerController.update);
bannerRouter.delete('/:id', authMiddleware, adminMiddleware, BannerController.delete);

export default bannerRouter;