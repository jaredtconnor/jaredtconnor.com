import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router/index.js';
import { createContext } from './context.js';

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production'
  }));
  
  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://jaredconnor.dev', 'https://blog.jaredconnor.dev']
      : true,
    credentials: true
  }));

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // tRPC middleware
  app.use('/trpc', createExpressMiddleware({
    router: appRouter,
    createContext,
  }));

  // Catch-all for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}