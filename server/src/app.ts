import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler); // Global error handler

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;