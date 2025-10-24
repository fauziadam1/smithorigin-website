import { Request, Response } from 'express';
import { ReplyService } from '../services/replyService';

export class ReplyController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const forumId = parseInt(req.params.forumId);
      const { content } = req.body;

      if (isNaN(forumId)) {
        return res.status(400).json({ message: 'Forum ID tidak valid' });
      }

      if (!content) {
        return res.status(400).json({ message: 'Konten reply harus diisi' });
      }

      const reply = await ReplyService.create(req.user.id, forumId, content);
      res.status(201).json({
        message: 'Reply berhasil dibuat',
        data: reply,
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
      const { content } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      if (!content) {
        return res.status(400).json({ message: 'Konten reply harus diisi' });
      }

      const reply = await ReplyService.update(id, req.user.id, req.user.isAdmin, content);
      res.status(200).json({
        message: 'Reply berhasil diupdate',
        data: reply,
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

      await ReplyService.delete(id, req.user.id, req.user.isAdmin);
      res.status(200).json({ message: 'Reply berhasil dihapus' });
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }
}