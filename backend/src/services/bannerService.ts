import { prisma } from '../lib/prisma';
import { FileHelper } from '../lib/helper';

export class BannerService {
  static async getAll() {
    return await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        imageUrl: true,
        createdAt: true,
      },
    });
  }

  static async getById(id: number) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new Error('Banner tidak ditemukan');
    }
    return banner;
  }

  static async create(imageUrl: string) {
    return await prisma.banner.create({
      data: { imageUrl },
      select: {
        id: true,
        imageUrl: true,
        createdAt: true,
      },
    });
  }

  static async update(id: number, imageUrl: string) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new Error('Banner tidak ditemukan');
    }

    if (banner.imageUrl && banner.imageUrl !== imageUrl) {
      FileHelper.deleteFile(banner.imageUrl);
    }

    return await prisma.banner.update({
      where: { id },
      data: { imageUrl },
    });
  }

  static async delete(id: number) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new Error('Banner tidak ditemukan');
    }

    FileHelper.deleteFile(banner.imageUrl);

    await prisma.banner.delete({ where: { id } });
  }
}