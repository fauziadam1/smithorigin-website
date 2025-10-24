import { prisma } from '../lib/prisma';

export class ProductService {
  static async getAll(page = 1, limit = 10, categoryId?: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
          _count: { select: { favorites: true } },
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        _count: { select: { favorites: true } },
      },
    });

    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    return product;
  }

  static async create(data: {
    name: string;
    description?: string;
    price: number;
    discount?: number;
    imageUrl?: string;
    categoryId?: number;
  }) {
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new Error('Kategori tidak ditemukan');
      }
    }

    return await prisma.product.create({
      data,
      include: { category: true, variants: true },
    });
  }

  static async update(id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    discount?: number;
    imageUrl?: string;
    categoryId?: number;
  }) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new Error('Kategori tidak ditemukan');
      }
    }

    return await prisma.product.update({
      where: { id },
      data,
      include: { category: true, variants: true },
    });
  }

  static async delete(id: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    await prisma.product.delete({ where: { id } });
  }
}