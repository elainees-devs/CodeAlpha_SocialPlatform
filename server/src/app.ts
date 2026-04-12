import express from 'express';
import cors from 'cors';
import { env } from './config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;