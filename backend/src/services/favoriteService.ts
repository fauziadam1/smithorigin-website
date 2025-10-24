import { prisma } from '../lib/prisma';

export class FavoriteService {
  static async getUserFavorites(userId: number) {
    return await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            variants: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  static async addFavorite(userId: number, productId: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      throw new Error('Produk sudah ada di favorit');
    }

    return await prisma.favorite.create({
      data: { userId, productId },
      include: { product: true },
    });
  }

  static async removeFavorite(userId: number, productId: number) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!favorite) {
      throw new Error('Favorit tidak ditemukan');
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }
}