import { Router, Request, Response } from 'express';
import { AuthService } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
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

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    const tokens = await AuthService.login(email, password);
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

export default router;