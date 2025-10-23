import { Router, Request, Response } from 'express';
import { AuthService } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, dan password harus diisi' });
    }

    const tokens = await AuthService.register(username, email, password);
    res.status(201).json({
      message: 'Registrasi berhasil',
      data: tokens,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/register-admin', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    const tokens = await AuthService.registerAdmin(username, password);
    res.status(201).json({
      message: 'Admin berhasil dibuat',
      data: tokens,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    const tokens = await AuthService.login(username, password);
    res.status(200).json({
      message: 'Login berhasil',
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token harus diisi' });
    }

    const tokens = await AuthService.refreshToken(refreshToken);
    res.status(200).json({
      message: 'Token diperbarui',
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
});

router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Tidak terautentikasi' });
    }

    await AuthService.logout(req.user.id);
    res.status(200).json({ message: 'Logout berhasil' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post('/change-password', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Tidak terautentikasi' });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan baru harus diisi' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    await AuthService.changePassword(req.user.id, oldPassword, newPassword);
    res.status(200).json({ message: 'Password berhasil diubah. Silakan login kembali' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/reset-password', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Tidak terautentikasi' });
    }

    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'User ID dan password baru harus diisi' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    await AuthService.resetPassword(req.user.id, userId, newPassword);
    res.status(200).json({ message: 'Password berhasil direset' });
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
});

// Endpoint untuk membuat admin (HANYA UNTUK DEVELOPMENT)
// Hapus atau comment setelah admin dibuat
router.post('/create-admin', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email otomatis untuk admin
    const adminEmail = `${username}@admin.local`;

    const admin = await prisma.user.create({
      data: {
        username,
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    res.status(201).json({
      message: 'Admin berhasil dibuat',
      data: {
        id: admin.id,
        username: admin.username,
        isAdmin: admin.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;