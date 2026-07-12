import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as authService from './auth.service.js';
import { env } from '../../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.cookie('token', token, COOKIE_OPTIONS);
  return sendSuccess(res, 201, 'Registered successfully', { user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.cookie('token', token, COOKIE_OPTIONS);
  return sendSuccess(res, 200, 'Logged in successfully', { user, token });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, 200, 'Current user', { user });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return sendSuccess(res, 200, 'Logged out successfully');
});
