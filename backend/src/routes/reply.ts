import { Router } from 'express';
import { ReplyController } from '../controllers/replyController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const replyRouter = Router();

replyRouter.post('/forums/:forumId/replies', authMiddleware, ReplyController.create);
replyRouter.put('/replies/:id', authMiddleware, ReplyController.update);
replyRouter.delete('/replies/:id', authMiddleware, ReplyController.delete);

export default replyRouter;