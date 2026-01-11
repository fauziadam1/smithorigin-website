import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_EXPIRE,
} from '../utils/jwt'
import { JwtPayload } from '../types'

export class AuthService {
  static async register(username: string, email: string, password: string) {
    const exists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    })
    if (exists) throw new Error('Username atau email sudah digunakan')

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    })

    return this.issueTokens(user)
  }

  static async registerAdmin(username: string, password: string) {
    const exists = await prisma.user.findUnique({
      where: { username },
    })
    if (exists) throw new Error('Username sudah digunakan')

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { 
        username, 
        email: `${username}@admin.local`,
        password: hashed,
        isAdmin: true,
      },
    })

    return this.issueTokens(user)
  }

  static async login(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) throw new Error('Username atau password salah')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Username atau password salah')

    return this.issueTokens(user)
  }

  static async refreshToken(oldRefreshToken: string) {
    let decoded: JwtPayload

    try {
      decoded = jwt.verify(
        oldRefreshToken,
        JWT_REFRESH_SECRET
      ) as JwtPayload
    } catch {
      throw new Error('Refresh token tidak valid')
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new Error('Refresh token tidak valid')
    }

    return this.issueTokens(user)
  }

  static async logout(userId: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
  }

  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User tidak ditemukan')

    const valid = await bcrypt.compare(oldPassword, user.password)
    if (!valid) throw new Error('Password lama salah')

    const hashed = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        refreshToken: null,
      },
    })
  }

  private static async issueTokens(user: any) {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    })

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRE,
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    }
  }
}