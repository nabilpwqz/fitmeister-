import { createApp } from './app';
import { env } from './config/env';
import { initSocketServer } from './socket';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`[FitMeister API] Server active at http://localhost:${env.PORT}`);
  console.log(`[FitMeister API] Interactive OpenAPI Docs: http://localhost:${env.PORT}/api/v1/docs`);
});

initSocketServer(server);

const gracefulShutdown = () => {
  console.log('[FitMeister API] Shutting down gracefully...');
  server.close(() => {
    console.log('[FitMeister API] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
