// src/controllers/forumController.ts

import { Request, Response } from 'express';
import { ForumService } from '../services/forumService';
import { ForumReplyService } from '../services/forumService';

export class ForumController {
  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await ForumService.getAll(page, limit, search);
      res.status(200).json({
        message: 'Berhasil mengambil data forum',
        data: result.forums,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      const forum = await ForumService.getById(id);
      res.status(200).json({
        message: 'Berhasil mengambil data forum',
        data: forum,
      });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Judul dan konten harus diisi' });
      }

      const forum = await ForumService.create(req.user.id, title, content);
      res.status(201).json({
        message: 'Forum berhasil dibuat',
        data: forum,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const id = parseInt(req.params.id);
      const { title, content } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      if (!title || !content) {
        return res.status(400).json({ message: 'Judul dan konten harus diisi' });
      }

      const forum = await ForumService.update(id, req.user.id, req.user.isAdmin, title, content);
      res.status(200).json({
        message: 'Forum berhasil diupdate',
        data: forum,
      });
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      await ForumService.delete(id, req.user.id, req.user.isAdmin);
      res.status(200).json({ message: 'Forum berhasil dihapus' });
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }

  static async toggleLike(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi' });

      const forumId = parseInt(req.params.id);
      if (isNaN(forumId)) return res.status(400).json({ message: 'ID forum tidak valid' });

      const result = await ForumService.toggleLike(forumId, req.user.id);
      res.status(200).json({ message: 'Success', data: result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async createReply(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const forumId = parseInt(req.params.forumId);
      const { content, parentId } = req.body;

      if (isNaN(forumId)) {
        return res.status(400).json({ message: 'ID forum tidak valid' });
      }
      if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Konten balasan tidak boleh kosong' });
      }

      const reply = await ForumReplyService.create(
        forumId,
        req.user.id,
        content,
        parentId ? parseInt(parentId) : null
      );

      res.status(201).json({
        message: 'Balasan berhasil dibuat',
        data: reply,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async updateReply(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const id = parseInt(req.params.id);
      const { content } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID balasan tidak valid' });
      }
      if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Konten balasan tidak boleh kosong' });
      }

      const reply = await ForumReplyService.update(id, req.user.id, req.user.isAdmin, content);

      res.status(200).json({
        message: 'Balasan berhasil diupdate',
        data: reply,
      });
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }

  static async deleteReply(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID balasan tidak valid' });
      }

      await ForumReplyService.delete(id, req.user.id, req.user.isAdmin);
      res.status(200).json({ message: 'Balasan berhasil dihapus' });
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }
}