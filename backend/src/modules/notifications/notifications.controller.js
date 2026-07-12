import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as notificationsService from './notifications.service.js';

export const listMine = asyncHandler(async (req, res) => {
  const { items, meta } = await notificationsService.listMine(req.user.id, req.query);
  return sendSuccess(res, 200, 'Notifications fetched', items, meta);
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationsService.markRead(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'Notification marked read', notification);
});

export const markAllRead = asyncHandler(async (req, res) => {
  const count = await notificationsService.markAllRead(req.user.id);
  return sendSuccess(res, 200, 'All notifications marked read', { count });
});
