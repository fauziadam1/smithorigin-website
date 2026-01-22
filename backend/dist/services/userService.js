"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../lib/prisma");
class UserService {
    static async getProfile(userId) {
        return prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                isAdmin: true,
                createdAt: true,
            },
        });
    }
    static async getPublicProfile(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                createdAt: true,
            },
        });
    }
}
exports.UserService = UserService;
