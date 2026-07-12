import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as badgesService from './badges.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await badgesService.list(req.query);
  return sendSuccess(res, 200, 'Badges fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const badge = await badgesService.getById(req.params.id);
  return sendSuccess(res, 200, 'Badge fetched', badge);
});

export const create = asyncHandler(async (req, res) => {
  const badge = await badgesService.create(req.body);
  return sendSuccess(res, 201, 'Badge created', badge);
});

export const update = asyncHandler(async (req, res) => {
  const badge = await badgesService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Badge updated', badge);
});

export const remove = asyncHandler(async (req, res) => {
  await badgesService.remove(req.params.id);
  return sendSuccess(res, 200, 'Badge deactivated');
});
