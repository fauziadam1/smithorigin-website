import { prisma } from '../lib/prisma'

export class UserService {
  static async getProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    })
  }

  static async getPublicProfile(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    })
  }
}
