import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../utils/jwt';
import { JwtPayload } from '../types';
import { prisma } from '../lib/prisma';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      throw new Error('No access token');
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    return next();
  } catch {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Silakan login kembali' });
      }

      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ message: 'Refresh token tidak valid' });
      }

      const newAccessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      req.user = decoded;

      return next();
    } catch {
      return res.status(401).json({ message: 'Sesi anda telah berakhir silahkan login kembali' });
    }
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin' });
  }
  next();
};