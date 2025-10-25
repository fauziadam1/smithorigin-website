import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth';
import replyRouter from './routes/reply';
import forumRouter from './routes/forum';
import bannerRouter from './routes/banner';
import productRoutes from './routes/product';
import variantRouter from './routes/variant';
import favoriteRouter from './routes/favorite';
import categoryRoutes from './routes/category';
import { authMiddleware } from './middleware/auth';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api', variantRouter);
app.use('/api/banners', bannerRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/forums', forumRouter);
app.use('/api', replyRouter);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('public/uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

export default app;