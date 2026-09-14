import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

// Initialize SQLite DB tables and default demo users
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS settings for Vite frontend
app.use(cors({
  origin: true, // Allow frontend origin
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    serverTime: new Date().toISOString(),
    database: 'SQLite WAL Mode Active',
    version: '1.0.0'
  });
});

// Mounting Auth, Admin & Quiz API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'Sunucu tarafında beklenmeyen bir hata oluştu.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Auth API Backend Server is running on http://localhost:${PORT}`);
  console.log(`📌 Health Check: http://localhost:${PORT}/api/health`);
});
