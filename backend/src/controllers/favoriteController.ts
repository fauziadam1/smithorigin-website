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
        return res.status(401).json({ message: 'Tidak terautentikasi' })
      }

      const productId = Number(req.body.productId)
      if (!Number.isInteger(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid' })
      }

      const favorite = await FavoriteService.addFavorite(
        req.user.id,
        productId
      )

      return res.status(200).json({
        message: 'OK',
        data: favorite,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
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