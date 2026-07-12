import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as rewardsService from './rewards.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await rewardsService.list(req.query);
  return sendSuccess(res, 200, 'Rewards fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const reward = await rewardsService.getById(req.params.id);
  return sendSuccess(res, 200, 'Reward fetched', reward);
});

export const create = asyncHandler(async (req, res) => {
  const reward = await rewardsService.create(req.body);
  return sendSuccess(res, 201, 'Reward created', reward);
});

export const update = asyncHandler(async (req, res) => {
  const reward = await rewardsService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Reward updated', reward);
});

export const remove = asyncHandler(async (req, res) => {
  await rewardsService.remove(req.params.id);
  return sendSuccess(res, 200, 'Reward deactivated');
});
