import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, CategoryController.create);
router.put('/:id', authMiddleware, adminMiddleware, CategoryController.update);
router.delete('/:id', authMiddleware, adminMiddleware, CategoryController.delete);

export default router;