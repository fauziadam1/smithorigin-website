import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', authMiddleware, adminMiddleware, ProductController.create);
router.put('/:id', authMiddleware, adminMiddleware, ProductController.update);
router.delete('/:id', authMiddleware, adminMiddleware, ProductController.delete);

export default router;