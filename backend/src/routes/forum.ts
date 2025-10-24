import { Router } from 'express';
import { ForumController } from '../controllers/forumController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const forumRouter = Router();

forumRouter.get('/', ForumController.getAll);
forumRouter.get('/:id', ForumController.getById);
forumRouter.post('/', authMiddleware, ForumController.create);
forumRouter.put('/:id', authMiddleware, ForumController.update);
forumRouter.delete('/:id', authMiddleware, ForumController.delete);

export default forumRouter;