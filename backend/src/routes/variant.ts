import { Router } from 'express';
import { VariantController } from '../controllers/variantController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const variantRouter = Router();

variantRouter.get('/products/:productId/variants', VariantController.getByProductId);
variantRouter.post('/products/:productId/variants', authMiddleware, adminMiddleware, VariantController.create);
variantRouter.put('/variants/:id', authMiddleware, adminMiddleware, VariantController.update);
variantRouter.delete('/products/:productId/variants/:id', authMiddleware, adminMiddleware, VariantController.delete);

export default variantRouter;