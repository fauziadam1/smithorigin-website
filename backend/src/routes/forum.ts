import { Router } from 'express';
import { ForumController } from '../controllers/forumController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { Request, Response } from 'express';
import { ForumService } from '../services/forumService';

const forumRouter = Router();

forumRouter.get('/', ForumController.getAll);
forumRouter.get('/:id', ForumController.getById);
forumRouter.post('/', authMiddleware, ForumController.create);
forumRouter.put('/:id', authMiddleware, ForumController.update);
forumRouter.delete('/:id', authMiddleware, ForumController.delete);
forumRouter.post('/:id/like', authMiddleware, ForumController.toggleLike);

forumRouter.post('/:id/like', authMiddleware, async (req: Request, res: Response) => {
  try {
    const forumId = parseInt(req.params.id);
    const result = await ForumService.toggleLike(forumId, req.user!.id);
    res.status(200).json({ message: 'Success', data: result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default forumRouter;