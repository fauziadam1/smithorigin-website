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

    // Favorite hanya relasi, tidak ada file untuk dihapus
    await prisma.favorite.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }
}

// ==================== ForumService ====================
export class ForumService {
  static async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [forums, total] = await Promise.all([
      prisma.forum.findMany({
        where,
        include: {
          user: { select: { id: true, username: true } },
          likes: { select: { userId: true } },
          _count: { select: { replies: true, likes: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.forum.count({ where }),
    ]);

    return {
      forums,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const forum = await prisma.forum.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        replies: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'asc' },
        },
        likes: { select: { userId: true } },
        _count: { select: { replies: true, likes: true } },
      },
    });

    if (!forum) throw new Error('Forum tidak ditemukan');

    return forum;
  }

  static async create(userId: number, title: string, content: string) {
    return await prisma.forum.create({
      data: { userId, title, content },
      include: { user: { select: { id: true, username: true } } },
    });
  }

  static async update(id: number, userId: number, isAdmin: boolean, title: string, content: string) {
    const forum = await prisma.forum.findUnique({ where: { id } });
    if (!forum) throw new Error('Forum tidak ditemukan');
    if (forum.userId !== userId && !isAdmin) throw new Error('Tidak memiliki akses untuk mengupdate forum ini');

    return await prisma.forum.update({
      where: { id },
      data: { title, content },
      include: { user: { select: { id: true, username: true } } },
    });
  }

  static async delete(id: number, userId: number, isAdmin: boolean) {
    const forum = await prisma.forum.findUnique({ where: { id } });
    if (!forum) throw new Error('Forum tidak ditemukan');
    if (forum.userId !== userId && !isAdmin) throw new Error('Tidak memiliki akses untuk menghapus forum ini');

    await prisma.forum.delete({ where: { id } });
  }

  static async toggleLike(forumId: number, userId: number) {
    const forum = await prisma.forum.findUnique({ where: { id: forumId } });
    if (!forum) throw new Error('Forum tidak ditemukan');

    const existingLike = await prisma.forumLike.findUnique({
      where: { forumId_userId: { forumId, userId } },
    });

    if (existingLike) {
      await prisma.forumLike.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.forumLike.create({ data: { forumId, userId } });
    }

    const likeCount = await prisma.forumLike.count({ where: { forumId } });

    return { forumId, liked: !existingLike, likeCount };
  }
}