import { prisma } from '../lib/prisma';

export class FavoriteService {
  static async getUserFavorites(userId: number) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true,
      },
    })
  }

  static async addFavorite(userId: number, productId: number) {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        productId,
      },
    })

    if (existing) {
      return existing
    }

    return prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    })
  }

  static async removeFavorite(userId: number, productId: number) {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        productId,
      },
    })

    if (!existing) {
      return
    }

    await prisma.favorite.delete({
      where: { id: existing.id },
    })
  }
}