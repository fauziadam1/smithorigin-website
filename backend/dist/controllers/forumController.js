"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumController = void 0;
const forumService_1 = require("../services/forumService");
class ForumController {
    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await forumService_1.ForumService.getAll(page, limit, search);
            res.status(200).json({
                message: 'Berhasil mengambil data forum',
                data: result.forums,
                pagination: result.pagination,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ message: 'ID tidak valid' });
            const forum = await forumService_1.ForumService.getById(id);
            res.status(200).json({ message: 'Success', data: forum });
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    static async create(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            const { title, content } = req.body;
            if (!title || !content) {
                return res.status(400).json({ message: 'Judul dan konten harus diisi' });
            }
            const forum = await forumService_1.ForumService.create(req.user.id, title, content);
            res.status(201).json({ message: 'Forum berhasil dibuat', data: forum });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async update(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            const id = parseInt(req.params.id);
            const { title, content } = req.body;
            if (isNaN(id))
                return res.status(400).json({ message: 'ID tidak valid' });
            const forum = await forumService_1.ForumService.update(id, req.user.id, req.user.isAdmin, title, content);
            res.status(200).json({ message: 'Forum berhasil diupdate', data: forum });
        }
        catch (error) {
            res.status(403).json({ message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            const id = parseInt(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ message: 'ID tidak valid' });
            await forumService_1.ForumService.delete(id, req.user.id, req.user.isAdmin);
            res.status(200).json({ message: 'Forum berhasil dihapus' });
        }
        catch (error) {
            res.status(403).json({ message: error.message });
        }
    }
    static async toggleLike(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            }
            const forumId = parseInt(req.params.id);
            if (isNaN(forumId)) {
                return res.status(400).json({ message: 'ID forum tidak valid' });
            }
            const result = await forumService_1.ForumService.toggleLike(forumId, req.user.id);
            res.status(200).json({
                message: 'Success',
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    static async createReply(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            const forumId = parseInt(req.params.forumId);
            const { content, parentId } = req.body;
            if (isNaN(forumId))
                return res.status(400).json({ message: 'Forum ID tidak valid' });
            if (!content?.trim()) {
                return res.status(400).json({ message: 'Konten balasan tidak boleh kosong' });
            }
            const reply = await forumService_1.ForumService.createReply(forumId, req.user.id, content, parentId ? parseInt(parentId) : null);
            res.status(201).json({ message: 'Balasan berhasil dibuat', data: reply });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async updateReply(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            const id = parseInt(req.params.id);
            const { content } = req.body;
            if (isNaN(id))
                return res.status(400).json({ message: 'ID balasan tidak valid' });
            if (!content?.trim()) {
                return res.status(400).json({ message: 'Konten balasan tidak boleh kosong' });
            }
            const reply = await forumService_1.ForumService.updateReply(id, req.user.id, req.user.isAdmin, content);
            res.status(200).json({ message: 'Balasan berhasil diupdate', data: reply });
        }
        catch (error) {
            res.status(403).json({ message: error.message });
        }
    }
    static async deleteReply(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            const id = parseInt(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ message: 'ID balasan tidak valid' });
            await forumService_1.ForumService.deleteReply(id, req.user.id, req.user.isAdmin);
            res.status(200).json({ message: 'Balasan berhasil dihapus' });
        }
        catch (error) {
            res.status(403).json({ message: error.message });
        }
    }
}
exports.ForumController = ForumController;
