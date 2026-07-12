import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  return sendSuccess(res, 201, 'Registered successfully', { user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  return sendSuccess(res, 200, 'Logged in successfully', { user, token });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, 200, 'Current user', { user });
});

export const logout = asyncHandler(async (req, res) => {
  // Stateless JWT in a Bearer header — nothing server-side to clear; the
  // client just drops the token it's holding.
  return sendSuccess(res, 200, 'Logged out successfully');
});
