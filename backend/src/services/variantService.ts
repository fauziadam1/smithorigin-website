import { prisma } from '../lib/prisma';

export class VariantService {
  static async getByProductId(productId: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    return await prisma.productVariant.findMany({
      where: { productId },
      orderBy: { id: 'desc' },
    });
  }

  static async create(productId: number, color: string, imageUrl?: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    return await prisma.productVariant.create({
      data: { productId, color, imageUrl },
    });
  }

  static async update(id: number, color: string, imageUrl?: string) {
    const variant = await prisma.productVariant.findUnique({ where: { id } });
    if (!variant) {
      throw new Error('Varian tidak ditemukan');
    }

    return await prisma.productVariant.update({
      where: { id },
      data: { color, imageUrl },
    });
  }

  static async delete(id: number) {
    const variant = await prisma.productVariant.findUnique({ where: { id } });
    if (!variant) {
      throw new Error('Varian tidak ditemukan');
    }

    await prisma.productVariant.delete({ where: { id } });
  }
}
