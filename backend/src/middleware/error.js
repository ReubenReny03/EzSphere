import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFound = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const mapError = (err) => {
  if (err instanceof AppError) return err;

  if (err.name === 'ValidationError') {
    const errors = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, [e.message]]),
    );
    return new AppError(422, 'Validation failed', errors);
  }

  if (err.name === 'CastError') {
    return new AppError(400, `Invalid value for field "${err.path}"`);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new AppError(409, `Duplicate value for "${field}"`);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return new AppError(401, 'Invalid or expired token');
  }

  return new AppError(500, env.NODE_ENV === 'production' ? 'Internal server error' : err.message);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const appError = mapError(err);

  logger.error(
    { err, statusCode: appError.statusCode, path: req.originalUrl },
    'Request error',
  );

  new ApiResponse(appError.statusCode, appError.message, null, appError.errors).send(
    res,
    appError.statusCode,
  );
};
