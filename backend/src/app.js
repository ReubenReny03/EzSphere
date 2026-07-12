import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'node:path';
import { env } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { logger } from './utils/logger.js';
import { notFound, errorHandler } from './middleware/error.js';
import apiRoutes from './modules/routes.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(mongoSanitize()); // strips `$`/`.` operators from req data — blocks NoSQL injection
app.use(hpp());
app.use(pinoHttp({ logger }));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use('/api/v1', globalLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Helmet's default Cross-Origin-Resource-Policy: same-origin blocks the
// frontend (a different port/origin) from loading these as <img src>. Only
// uploads need the relaxed policy — the rest of the API keeps the default.
app.use('/uploads', helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }), express.static(path.resolve(env.UPLOAD_DIR)));
app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
