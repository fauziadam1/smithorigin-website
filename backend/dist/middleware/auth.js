"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../lib/prisma");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(' ')[1];
        if (!accessToken) {
            throw new Error('No access token');
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, jwt_1.JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Silakan login kembali' });
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, jwt_1.JWT_REFRESH_SECRET);
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({ message: 'Refresh token tidak valid' });
            }
            const newAccessToken = jsonwebtoken_1.default.sign({
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            }, jwt_1.JWT_SECRET, { expiresIn: '15m' });
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
            req.user = decoded;
            return next();
        }
        catch {
            return res.status(401).json({ message: 'Sesi anda telah berakhir silahkan login kembali' });
        }
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Akses ditolak. Hanya admin' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
