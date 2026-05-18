import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import generateRoutes from './routes/generate.routes.js';
import scriptsRoutes from './routes/scripts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import feedRoutes from './routes/feed.routes.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', service: 'filmyaf-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/scripts', scriptsRoutes); 
app.use('/api/comments', commentsRoutes); 
app.use('/api/feed', feedRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` },
  });
});

app.use(errorMiddleware);
