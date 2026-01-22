"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumService = exports.FavoriteService = void 0;
const prisma_1 = require("../lib/prisma");
class FavoriteService {
    static async getUserFavorites(userId) {
        return await prisma_1.prisma.favorite.findMany({
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
    static async addFavorite(userId, productId) {
        const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Produk tidak ditemukan');
        const existing = await prisma_1.prisma.favorite.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (existing)
            throw new Error('Produk sudah ada di favorit');
        return await prisma_1.prisma.favorite.create({
            data: { userId, productId },
            include: { product: true },
        });
    }
    static async removeFavorite(userId, productId) {
        const favorite = await prisma_1.prisma.favorite.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (!favorite)
            throw new Error('Favorit tidak ditemukan');
        await prisma_1.prisma.favorite.delete({
            where: { userId_productId: { userId, productId } },
        });
    }
}
exports.FavoriteService = FavoriteService;
class ForumService {
    static async getAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [forums, total] = await Promise.all([
            prisma_1.prisma.forum.findMany({
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
            prisma_1.prisma.forum.count({ where }),
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
    static async addRepliesRecursively(replies) {
        for (const reply of replies) {
            const children = await prisma_1.prisma.forumReply.findMany({
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
    static async getById(id) {
        const forum = await prisma_1.prisma.forum.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, username: true } },
                likes: { select: { userId: true } },
                _count: { select: { replies: true, likes: true } },
            },
        });
        if (!forum)
            throw new Error('Forum tidak ditemukan');
        const topLevelReplies = await prisma_1.prisma.forumReply.findMany({
            where: { forumId: id, parentId: null },
            include: {
                user: { select: { id: true, username: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const nestedReplies = await this.addRepliesRecursively(topLevelReplies);
        return { ...forum, replies: nestedReplies };
    }
    static async create(userId, title, content) {
        return await prisma_1.prisma.forum.create({
            data: { userId, title, content },
            include: { user: { select: { id: true, username: true } } },
        });
    }
    static async update(id, userId, isAdmin, title, content) {
        const forum = await prisma_1.prisma.forum.findUnique({ where: { id } });
        if (!forum)
            throw new Error('Forum tidak ditemukan');
        if (forum.userId !== userId && !isAdmin)
            throw new Error('Tidak memiliki akses untuk mengupdate forum ini');
        return await prisma_1.prisma.forum.update({
            where: { id },
            data: { title, content },
            include: { user: { select: { id: true, username: true } } },
        });
    }
    static async delete(id, userId, isAdmin) {
        const forum = await prisma_1.prisma.forum.findUnique({ where: { id } });
        if (!forum)
            throw new Error('Forum tidak ditemukan');
        if (forum.userId !== userId && !isAdmin)
            throw new Error('Tidak memiliki akses untuk menghapus forum ini');
        await prisma_1.prisma.forum.delete({ where: { id } });
    }
    static async toggleLike(forumId, userId) {
        const forum = await prisma_1.prisma.forum.findUnique({ where: { id: forumId } });
        if (!forum)
            throw new Error('Forum tidak ditemukan');
        const existingLike = await prisma_1.prisma.forumLike.findUnique({
            where: { forumId_userId: { forumId, userId } },
        });
        if (existingLike) {
            await prisma_1.prisma.forumLike.delete({ where: { id: existingLike.id } });
        }
        else {
            await prisma_1.prisma.forumLike.create({ data: { forumId, userId } });
        }
        const likeCount = await prisma_1.prisma.forumLike.count({ where: { forumId } });
        return { forumId, liked: !existingLike, likeCount };
    }
    static async createReply(forumId, userId, content, parentId) {
        const forum = await prisma_1.prisma.forum.findUnique({ where: { id: forumId } });
        if (!forum)
            throw new Error('Forum tidak ditemukan');
        if (parentId) {
            const parent = await prisma_1.prisma.forumReply.findUnique({ where: { id: parentId } });
            if (!parent)
                throw new Error('Balasan induk tidak ditemukan');
        }
        return await prisma_1.prisma.forumReply.create({
            data: { forumId, userId, content, parentId },
            include: { user: { select: { id: true, username: true } } },
        });
    }
    static async updateReply(id, userId, isAdmin, content) {
        const reply = await prisma_1.prisma.forumReply.findUnique({ where: { id } });
        if (!reply)
            throw new Error('Balasan tidak ditemukan');
        if (reply.userId !== userId && !isAdmin)
            throw new Error('Tidak memiliki akses untuk mengupdate balasan ini');
        return await prisma_1.prisma.forumReply.update({
            where: { id },
            data: { content },
            include: { user: { select: { id: true, username: true } } },
        });
    }
    static async deleteReply(id, userId, isAdmin) {
        const reply = await prisma_1.prisma.forumReply.findUnique({ where: { id } });
        if (!reply)
            throw new Error('Balasan tidak ditemukan');
        if (reply.userId !== userId && !isAdmin)
            throw new Error('Tidak memiliki akses untuk menghapus balasan ini');
        await prisma_1.prisma.forumReply.deleteMany({
            where: {
                OR: [
                    { id },
                    { parentId: id }
                ]
            }
        });
    }
}
exports.ForumService = ForumService;
