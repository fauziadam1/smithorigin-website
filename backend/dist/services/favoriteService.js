"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const prisma_1 = require("../lib/prisma");
class FavoriteService {
    static async getUserFavorites(userId) {
        return prisma_1.prisma.favorite.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });
    }
    static async addFavorite(userId, productId) {
        const existing = await prisma_1.prisma.favorite.findFirst({
            where: {
                userId,
                productId,
            },
        });
        if (existing) {
            return existing;
        }
        return prisma_1.prisma.favorite.create({
            data: {
                userId,
                productId,
            },
        });
    }
    static async removeFavorite(userId, productId) {
        const existing = await prisma_1.prisma.favorite.findFirst({
            where: {
                userId,
                productId,
            },
        });
        if (!existing) {
            return;
        }
        await prisma_1.prisma.favorite.delete({
            where: { id: existing.id },
        });
    }
}
exports.FavoriteService = FavoriteService;
