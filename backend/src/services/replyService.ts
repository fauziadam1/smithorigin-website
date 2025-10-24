import { prisma } from '../lib/prisma';

export class ReplyService {
  static async create(userId: number, forumId: number, content: string) {
    const forum = await prisma.forum.findUnique({ where: { id: forumId } });
    if (!forum) {
      throw new Error('Forum tidak ditemukan');
    }

    return await prisma.forumReply.create({
      data: { userId, forumId, content },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  static async update(id: number, userId: number, isAdmin: boolean, content: string) {
    const reply = await prisma.forumReply.findUnique({ where: { id } });

    if (!reply) {
      throw new Error('Reply tidak ditemukan');
    }

    if (reply.userId !== userId && !isAdmin) {
      throw new Error('Tidak memiliki akses untuk mengupdate reply ini');
    }

    return await prisma.forumReply.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  static async delete(id: number, userId: number, isAdmin: boolean) {
    const reply = await prisma.forumReply.findUnique({ where: { id } });

    if (!reply) {
      throw new Error('Reply tidak ditemukan');
    }

    if (reply.userId !== userId && !isAdmin) {
      throw new Error('Tidak memiliki akses untuk menghapus reply ini');
    }

    await prisma.forumReply.delete({ where: { id } });
  }
}