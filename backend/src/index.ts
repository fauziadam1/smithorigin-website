import express from 'express';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';
import categoryRoutes from './routes/category';


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

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