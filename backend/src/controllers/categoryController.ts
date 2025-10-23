import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAll();
      res.status(200).json({
        message: 'Berhasil mengambil data kategori',
        data: categories,
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

      const category = await CategoryService.getById(id);
      res.status(200).json({
        message: 'Berhasil mengambil data kategori',
        data: category,
      });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, imageUrl } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Nama kategori harus diisi' });
      }

      const category = await CategoryService.create(name, imageUrl);
      res.status(201).json({
        message: 'Kategori berhasil dibuat',
        data: category,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, imageUrl } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      if (!name) {
        return res.status(400).json({ message: 'Nama kategori harus diisi' });
      }

      const category = await CategoryService.update(id, name, imageUrl);
      res.status(200).json({
        message: 'Kategori berhasil diupdate',
        data: category,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      await CategoryService.delete(id);
      res.status(200).json({
        message: 'Kategori berhasil dihapus',
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}