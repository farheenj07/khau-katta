import express from 'express';
import cors from 'cors';
import path from 'path';
import { authenticate } from './middleware/auth';
import categoriesRouter from './routes/categories';
import stallsRouter from './routes/stalls';
import productsRouter from './routes/products';
import statsRouter from './routes/stats';
import authRouter from './routes/auth';
import reviewsRouter from './routes/reviews';
import ordersRouter from './routes/orders';
import cartRouter from './routes/cart';
import uploadRouter from './routes/upload';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticate);

// Serve static uploaded files (e.g. stall photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/stalls', stallsRouter);
app.use('/api/products', productsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Khau Katta Belagavi Marketplace API',
    stage: 'Stage 2: Auth, PWA, Profiles & Verified Reviews',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[Khau Katta API] Server running on http://localhost:${PORT}`);
});
