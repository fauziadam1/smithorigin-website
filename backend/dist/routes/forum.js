"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forumService_1 = require("../services/forumService");
const forumController_1 = require("../controllers/forumController");
const auth_1 = require("../middleware/auth");
const forumRouter = (0, express_1.Router)();
forumRouter.get('/', forumController_1.ForumController.getAll);
forumRouter.get('/:id', forumController_1.ForumController.getById);
forumRouter.post('/', auth_1.authMiddleware, forumController_1.ForumController.create);
forumRouter.put('/:id', auth_1.authMiddleware, forumController_1.ForumController.update);
forumRouter.delete('/:id', auth_1.authMiddleware, forumController_1.ForumController.delete);
forumRouter.post('/:id/like', auth_1.authMiddleware, forumController_1.ForumController.toggleLike);
forumRouter.post('/:forumId/replies', auth_1.authMiddleware, forumController_1.ForumController.createReply);
forumRouter.put('/replies/:id', auth_1.authMiddleware, forumController_1.ForumController.updateReply);
forumRouter.delete('/replies/:id', auth_1.authMiddleware, forumController_1.ForumController.deleteReply);
forumRouter.post('/:id/like', auth_1.authMiddleware, async (req, res) => {
    try {
        const forumId = parseInt(req.params.id);
        const result = await forumService_1.ForumService.toggleLike(forumId, req.user.id);
        res.status(200).json({ message: 'Success', data: result });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = forumRouter;
