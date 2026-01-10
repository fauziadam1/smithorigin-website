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
    if (!product) throw new Error('Produk tidak ditemukan');

    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) throw new Error('Produk sudah ada di favorit');

    return await prisma.favorite.create({
      data: { userId, productId },
      include: { product: true },
    });
  }

  static async removeFavorite(userId: number, productId: number) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!favorite) throw new Error('Favorit tidak ditemukan');

    await prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });
  }
}

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

  private static async addRepliesRecursively(replies: any[]): Promise<any[]> {
    for (const reply of replies) {
      const children = await prisma.forumReply.findMany({
        where: { parentId: reply.id },
        include: {
          user: { select: { id: true, username: true } },
        },
        orderBy: { createdAt: 'asc' },
      });

      reply.replies = children.length
        ? await this.addRepliesRecursively(children)
        : [];
    }
    return replies;
  }

  static async getById(id: number) {
    const forum = await prisma.forum.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        likes: { select: { userId: true } },
        _count: { select: { replies: true, likes: true } },
      },
    });

    if (!forum) throw new Error('Forum tidak ditemukan');

    const topLevelReplies = await prisma.forumReply.findMany({
      where: { forumId: id, parentId: null },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const nestedReplies = await this.addRepliesRecursively(topLevelReplies);

    return { ...forum, replies: nestedReplies };
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
    if (forum.userId !== userId && !isAdmin)
      throw new Error('Tidak memiliki akses untuk mengupdate forum ini');

    return await prisma.forum.update({
      where: { id },
      data: { title, content },
      include: { user: { select: { id: true, username: true } } },
    });
  }

  static async delete(id: number, userId: number, isAdmin: boolean) {
    const forum = await prisma.forum.findUnique({ where: { id } });
    if (!forum) throw new Error('Forum tidak ditemukan');
    if (forum.userId !== userId && !isAdmin)
      throw new Error('Tidak memiliki akses untuk menghapus forum ini');

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

  static async createReply(
    forumId: number,
    userId: number,
    content: string,
    parentId?: number | null
  ) {
    const forum = await prisma.forum.findUnique({ where: { id: forumId } });
    if (!forum) throw new Error('Forum tidak ditemukan');

    if (parentId) {
      const parent = await prisma.forumReply.findUnique({ where: { id: parentId } });
      if (!parent) throw new Error('Balasan induk tidak ditemukan');
    }

    return await prisma.forumReply.create({
      data: { forumId, userId, content, parentId },
      include: { user: { select: { id: true, username: true } } },
    });
  }

  static async updateReply(
    id: number,
    userId: number,
    isAdmin: boolean,
    content: string
  ) {
    const reply = await prisma.forumReply.findUnique({ where: { id } });
    if (!reply) throw new Error('Balasan tidak ditemukan');
    if (reply.userId !== userId && !isAdmin)
      throw new Error('Tidak memiliki akses untuk mengupdate balasan ini');

    return await prisma.forumReply.update({
      where: { id },
      data: { content },
      include: { user: { select: { id: true, username: true } } },
    });
  }

  static async deleteReply(
    id: number,
    userId: number,
    isAdmin: boolean
  ) {
    const reply = await prisma.forumReply.findUnique({ where: { id } });
    if (!reply) throw new Error('Balasan tidak ditemukan');
    if (reply.userId !== userId && !isAdmin)
      throw new Error('Tidak memiliki akses untuk menghapus balasan ini');

    await prisma.forumReply.deleteMany({
      where: {
        OR: [
          { id },
          { parentId: id }
        ]
      }
    });
  }

}
