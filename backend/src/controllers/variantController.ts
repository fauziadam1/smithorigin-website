import { Request, Response } from 'express';
import { VariantService } from "../services/variantService";

export class VariantController {
  static async getByProductId(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid' });
      }

      const variants = await VariantService.getByProductId(productId);
      res.status(200).json({
        message: 'Berhasil mengambil data varian',
        data: variants,
      });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId);
      const { color, imageUrl } = req.body;

      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid' });
      }

      if (!color) {
        return res.status(400).json({ message: 'Warna harus diisi' });
      }

      const variant = await VariantService.create(productId, color, imageUrl);
      res.status(201).json({
        message: 'Varian berhasil dibuat',
        data: variant,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { color, imageUrl } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      if (!color) {
        return res.status(400).json({ message: 'Warna harus diisi' });
      }

      const variant = await VariantService.update(id, color, imageUrl);
      res.status(200).json({
        message: 'Varian berhasil diupdate',
        data: variant,
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

      await VariantService.delete(id);
      res.status(200).json({ message: 'Varian berhasil dihapus' });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}