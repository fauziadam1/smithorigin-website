import { prisma } from '../lib/prisma'
import { FileHelper } from '../lib/helper'

export class BannerService {
  static async getAll() {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        imageUrl: true,
        createdAt: true,
      },
    })

    return banners
  }

  static async getById(id: number) {
    const banner = await prisma.banner.findUnique({
      where: { id },
    })

    if (!banner) {
      throw new Error('Banner tidak ditemukan')
    }

    return banner
  }

  static async create(imageUrl: string) {
    const banner = await prisma.banner.create({
      data: { imageUrl },
      select: {
        id: true,
        imageUrl: true,
        createdAt: true,
      },
    })

    return banner
  }

  static async update(id: number, imageUrl: string) {
    const banner = await prisma.banner.findUnique({ where: { id } })
    if (!banner) {
      throw new Error('Banner tidak ditemukan')
    }

    if (banner.imageUrl && banner.imageUrl !== imageUrl) {
      FileHelper.deleteFile(banner.imageUrl)
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: { imageUrl },
    })

    return updatedBanner
  }

  static async delete(id: number) {
    const banner = await prisma.banner.findUnique({ where: { id } })
    if (!banner) {
      throw new Error('Banner tidak ditemukan')
    }

    FileHelper.deleteFile(banner.imageUrl)

    await prisma.banner.delete({ where: { id } })
  }
}
