import { prisma } from '../lib/prisma';

export class ForumService {
  static async getAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

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
          likes: { select: { userId: true } }, // ambil userId siapa saja yang like
          _count: { select: { replies: true, likes: true } }, // jumlah replies & likes
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
        likes: { select: { userId: true } }, // ambil likes juga
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
    // cek forum
    const forum = await prisma.forum.findUnique({ where: { id: forumId } });
    if (!forum) throw new Error('Forum tidak ditemukan');

    // cek apakah user sudah like forum ini
    const existingLike = await prisma.forumLike.findUnique({
      where: { forumId_userId: { forumId, userId } },
    });

    if (existingLike) {
      // unlike
      await prisma.forumLike.delete({ where: { id: existingLike.id } });
    } else {
      // like baru
      await prisma.forumLike.create({ data: { forumId, userId } });
    }

    // ambil jumlah like terbaru
    const likeCount = await prisma.forumLike.count({ where: { forumId } });

    return { forumId, liked: !existingLike, likeCount };
  }
}
