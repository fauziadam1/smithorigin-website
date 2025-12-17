import { Request, Response } from 'express'
import { ProductService } from '../services/productService'

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const categoryId = req.query.categoryId
        ? parseInt(req.query.categoryId as string)
        : undefined
      const search = req.query.search as string | undefined

      const result = await ProductService.getAll(page, limit, categoryId, search)

      res.status(200).json({
        message: 'Berhasil mengambil data produk',
        data: result.products,
        pagination: result.pagination,
      })
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' })
      }

      const product = await ProductService.getById(id)

      res.status(200).json({
        message: 'Berhasil mengambil data produk',
        data: product,
      })
    } catch (error) {
      res.status(404).json({ message: (error as Error).message })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        price,
        discount,
        imageUrl,
        categoryId,
        isBestSeller,
        tokopediaUrl,
        shopeeUrl,
      } = req.body

      if (!name || !price) {
        return res
          .status(400)
          .json({ message: 'Nama dan harga produk harus diisi' })
      }

      const product = await ProductService.create({
        name,
        description,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : undefined,
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        isBestSeller: Boolean(isBestSeller),
        tokopediaUrl,
        shopeeUrl,
      })

      res.status(201).json({
        message: 'Produk berhasil dibuat',
        data: product,
      })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' })
      }

      const {
        name,
        description,
        price,
        discount,
        imageUrl,
        categoryId,
        isBestSeller,
        tokopediaUrl,
        shopeeUrl,
      } = req.body

      const product = await ProductService.update(id, {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        discount: discount ? parseFloat(discount) : undefined,
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        isBestSeller: Boolean(isBestSeller),
        tokopediaUrl,
        shopeeUrl,
      })

      res.status(200).json({
        message: 'Produk berhasil diupdate',
        data: product,
      })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' })
      }

      await ProductService.delete(id)

      res.status(200).json({ message: 'Produk berhasil dihapus' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}


