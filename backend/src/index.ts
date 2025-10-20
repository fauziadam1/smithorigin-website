import express from 'express';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Data profil',
    user: req.user,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

export default app;