import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const favoriteRouter = Router();

favoriteRouter.get('/', authMiddleware, FavoriteController.getUserFavorites);
favoriteRouter.post('/', authMiddleware, FavoriteController.addFavorite);
favoriteRouter.delete('/:productId', authMiddleware, FavoriteController.removeFavorite);

export default favoriteRouter;