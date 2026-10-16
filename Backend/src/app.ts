import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { openApiSpec } from './docs/openapi';

import authRoutes from './modules/auth/auth.routes';
import roomsRoutes from './modules/rooms/rooms.routes';
import availabilityRoutes from './modules/availability/availability.routes';
import bookingsRoutes from './modules/bookings/bookings.routes';
import dashboardsRoutes from './modules/dashboards/dashboards.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';

export const createApp = () => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration supporting credentials for cookies
  app.use(
    cors({
      origin: [env.CLIENT_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    })
  );

  // Body and cookie parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Authentication token resolution middleware
  app.use(authenticateToken);

  // OpenAPI Swagger Documentation
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get('/api/v1/docs.json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  // Health and readiness probe
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      service: 'FitMeister Engine',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // API v1 Domain Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/rooms', roomsRoutes);
  app.use('/api/v1/availability', availabilityRoutes);
  app.use('/api/v1/bookings', bookingsRoutes);
  app.use('/api/v1/dashboards', dashboardsRoutes);
  app.use('/api/v1/reviews', reviewsRoutes);
  app.use('/api/v1/favorites', favoritesRoutes);

  // 404 Route Fallback
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} does not exist`,
      },
    });
  });

  // Central error middleware
  app.use(errorHandler);

  return app;
};

export default createApp;
