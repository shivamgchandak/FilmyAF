import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import generateRoutes from './routes/generate.routes.js';
import scriptsRoutes from './routes/scripts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import feedRoutes from './routes/feed.routes.js';
import takesRoutes from './routes/takes.routes.js';

export const app = express();

// Behind Render/Railway/Vercel the client IP and protocol arrive in headers.
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser(env.JWT_SECRET));
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
app.use('/api/takes', takesRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` },
  });
});

app.use(errorMiddleware);
