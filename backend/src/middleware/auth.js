import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from './asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) throw new AppError(401, 'Authentication required');

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    throw new AppError(401, 'Invalid or expired token');
  }
});

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) throw new AppError(401, 'Authentication required');
    if (!roles.includes(req.user.role)) throw new AppError(403, 'Insufficient permissions');
    return next();
  };
