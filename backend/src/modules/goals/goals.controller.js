import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as goalsService from './goals.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await goalsService.list(req.query);
  return sendSuccess(res, 200, 'Goals fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const goal = await goalsService.getById(req.params.id);
  return sendSuccess(res, 200, 'Goal fetched', goal);
});

export const create = asyncHandler(async (req, res) => {
  const goal = await goalsService.create(req.body);
  return sendSuccess(res, 201, 'Goal created', goal);
});

export const update = asyncHandler(async (req, res) => {
  const goal = await goalsService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Goal updated', goal);
});

export const remove = asyncHandler(async (req, res) => {
  await goalsService.remove(req.params.id);
  return sendSuccess(res, 200, 'Goal deleted');
});
