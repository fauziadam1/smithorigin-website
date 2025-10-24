import { Request, Response } from 'express';
import { BannerService } from '../services/bannerService';

export class BannerController {
  static async getAll(req: Request, res: Response) {
    try {
      const banners = await BannerService.getAll();
      res.status(200).json({
        message: 'Berhasil mengambil data banner',
        data: banners,
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

      const banner = await BannerService.getById(id);
      res.status(200).json({
        message: 'Berhasil mengambil data banner',
        data: banner,
      });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL harus diisi' });
      }

      const banner = await BannerService.create(imageUrl);
      res.status(201).json({
        message: 'Banner berhasil dibuat',
        data: banner,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { imageUrl } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL harus diisi' });
      }

      const banner = await BannerService.update(id, imageUrl);
      res.status(200).json({
        message: 'Banner berhasil diupdate',
        data: banner,
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

      await BannerService.delete(id);
      res.status(200).json({ message: 'Banner berhasil dihapus' });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}