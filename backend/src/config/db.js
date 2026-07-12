import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

mongoose.connection.on('connected', () => logger.info('Mongoose connected'));
mongoose.connection.on('error', (err) => logger.error({ err }, 'Mongoose connection error'));
mongoose.connection.on('disconnected', () => logger.warn('Mongoose disconnected'));

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export const connectDB = async (attempt = 1) => {
  try {
    await mongoose.connect(env.MONGO_URI);
  } catch (err) {
    logger.error({ err, attempt }, 'MongoDB connection failed');
    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => {
        setTimeout(resolve, RETRY_DELAY_MS);
      });
      return connectDB(attempt + 1);
    }
    logger.error('MongoDB connection failed after max retries — exiting');
    process.exit(1);
  }
  return mongoose.connection;
};
