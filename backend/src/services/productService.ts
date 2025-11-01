import { prisma } from '../lib/prisma';
import { FileHelper } from '../lib/helper';

export class ProductService {
  static async getAll(page = 1, limit = 10, categoryId?: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

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

    const productsWithCreatedAt = products.map(p => ({ ...p, createdAt: p.createdAt }));

    return {
      products: productsWithCreatedAt,
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

    return { ...product, createdAt: product.createdAt };
  }

  static async create(data: {
    name: string;
    description?: string;
    price: number;
    discount?: number;
    imageUrl?: string;
    categoryId?: number;
    isBestSeller?: boolean;
  }) {
    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) throw new Error('Kategori tidak ditemukan');
    }

    const product = await prisma.product.create({
      data,
      include: { category: true, variants: true },
    });

    return { ...product, createdAt: product.createdAt };
  }

  static async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      discount?: number;
      imageUrl?: string;
      categoryId?: number;
      isBestSeller?: boolean;
    }
  ) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error('Produk tidak ditemukan');

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) throw new Error('Kategori tidak ditemukan');
    }

    if (product.imageUrl && data.imageUrl && product.imageUrl !== data.imageUrl) {
      FileHelper.deleteFile(product.imageUrl);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: { category: true, variants: true },
    });

    return { ...updatedProduct, createdAt: updatedProduct.createdAt };
  }

  static async delete(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    FileHelper.deleteFile(product.imageUrl);

    const variantImages = product.variants
      .map(v => v.imageUrl)
      .filter((url): url is string => url !== null);
    FileHelper.deleteFiles(variantImages);

    await prisma.product.delete({ where: { id } });
  }
}