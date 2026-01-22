"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async register(username, email, password) {
        const exists = await prisma_1.prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });
        if (exists)
            throw new Error('Username atau email sudah digunakan');
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: { username, email, password: hashed },
        });
        return this.issueTokens(user);
    }
    static async registerAdmin(username, password) {
        const exists = await prisma_1.prisma.user.findUnique({
            where: { username },
        });
        if (exists)
            throw new Error('Username sudah digunakan');
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                username,
                email: `${username}@admin.local`,
                password: hashed,
                isAdmin: true,
            },
        });
        return this.issueTokens(user);
    }
    static async login(username, password) {
        const user = await prisma_1.prisma.user.findUnique({ where: { username } });
        if (!user)
            throw new Error('Username atau password salah');
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid)
            throw new Error('Username atau password salah');
        return this.issueTokens(user);
    }
    static async refreshToken(oldRefreshToken) {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(oldRefreshToken, jwt_1.JWT_REFRESH_SECRET);
        }
        catch {
            throw new Error('Sesi anda berakhir. Silahkan login kembali');
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user || user.refreshToken !== oldRefreshToken) {
            throw new Error('Sesi anda berakhir. Silahkan login kembali');
        }
        return this.issueTokens(user);
    }
    static async logout(userId) {
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    static async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User tidak ditemukan');
        const valid = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!valid)
            throw new Error('Password lama salah');
        const hashed = await bcrypt_1.default.hash(newPassword, 10);
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashed,
                refreshToken: null,
            },
        });
    }
    static async issueTokens(user) {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, jwt_1.JWT_SECRET, {
            expiresIn: jwt_1.JWT_EXPIRE,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, jwt_1.JWT_REFRESH_SECRET, {
            expiresIn: jwt_1.JWT_REFRESH_EXPIRE,
        });
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        };
    }
}
exports.AuthService = AuthService;
