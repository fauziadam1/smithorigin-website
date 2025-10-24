import { Request, Response } from 'express';
import { FavoriteService } from '../services/favoriteService';

export class FavoriteController {
  static async getUserFavorites(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const favorites = await FavoriteService.getUserFavorites(req.user.id);
      res.status(200).json({
        message: 'Berhasil mengambil data favorit',
        data: favorites,
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async addFavorite(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID harus diisi' });
      }

      const favorite = await FavoriteService.addFavorite(req.user.id, parseInt(productId));
      res.status(201).json({
        message: 'Produk berhasil ditambahkan ke favorit',
        data: favorite,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async removeFavorite(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const productId = parseInt(req.params.productId);

      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid' });
      }

      await FavoriteService.removeFavorite(req.user.id, productId);
      res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}