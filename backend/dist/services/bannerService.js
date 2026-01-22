"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const prisma_1 = require("../lib/prisma");
const helper_1 = require("../lib/helper");
class BannerService {
    static async getAll() {
        const banners = await prisma_1.prisma.banner.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                imageUrl: true,
                createdAt: true,
            },
        });
        return banners;
    }
    static async getById(id) {
        const banner = await prisma_1.prisma.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new Error('Banner tidak ditemukan');
        }
        return banner;
    }
    static async create(imageUrl) {
        const banner = await prisma_1.prisma.banner.create({
            data: { imageUrl },
            select: {
                id: true,
                imageUrl: true,
                createdAt: true,
            },
        });
        return banner;
    }
    static async update(id, imageUrl) {
        const banner = await prisma_1.prisma.banner.findUnique({ where: { id } });
        if (!banner) {
            throw new Error('Banner tidak ditemukan');
        }
        if (banner.imageUrl && banner.imageUrl !== imageUrl) {
            helper_1.FileHelper.deleteFile(banner.imageUrl);
        }
        const updatedBanner = await prisma_1.prisma.banner.update({
            where: { id },
            data: { imageUrl },
        });
        return updatedBanner;
    }
    static async delete(id) {
        const banner = await prisma_1.prisma.banner.findUnique({ where: { id } });
        if (!banner) {
            throw new Error('Banner tidak ditemukan');
        }
        helper_1.FileHelper.deleteFile(banner.imageUrl);
        await prisma_1.prisma.banner.delete({ where: { id } });
    }
}
exports.BannerService = BannerService;
