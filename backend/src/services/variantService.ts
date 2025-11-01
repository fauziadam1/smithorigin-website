import { prisma } from '../lib/prisma'
import { FileHelper } from '../lib/helper';

export class VariantService {
  static async getByProductId(productId: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Produk tidak ditemukan');

    return prisma.productVariant.findMany({
      where: { productId },
      orderBy: { id: 'desc' },
    });
  }

  static async create(productId: number, color: string, imageUrl?: string, price?: number | null) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Produk tidak ditemukan');

    return prisma.productVariant.create({
      data: {
        productId,
        color,
        imageUrl,
        price: price ?? null,
      },
    });
  }

  static async update(id: number, color: string, imageUrl?: string, price?: number | null) {
    const variant = await prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new Error('Varian tidak ditemukan');

    if (variant.imageUrl && imageUrl && variant.imageUrl !== imageUrl) {
      FileHelper.deleteFile(variant.imageUrl);
    }

    return prisma.productVariant.update({
      where: { id },
      data: {
        color,
        imageUrl,
        price: price ?? null,
      },
    });
  }

  static async delete(id: number) {
    const variant = await prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new Error('Varian tidak ditemukan');

    FileHelper.deleteFile(variant.imageUrl);

    await prisma.productVariant.delete({ where: { id } });
  }
}