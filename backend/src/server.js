import http from 'node:http';
import app from './app.js';
import './models/index.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { startOverdueScanner } from './services/overdueScanner.js';
import { logger } from './utils/logger.js';

const start = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);
  startOverdueScanner();

  httpServer.listen(env.PORT, () => {
    logger.info(`EcoSphere backend listening on port ${env.PORT}`);
  });
};

start().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
