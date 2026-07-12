import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as auditsService from './audits.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await auditsService.list(req.query);
  return sendSuccess(res, 200, 'Audits fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const audit = await auditsService.getById(req.params.id);
  return sendSuccess(res, 200, 'Audit fetched', audit);
});

export const create = asyncHandler(async (req, res) => {
  const audit = await auditsService.create(req.body);
  return sendSuccess(res, 201, 'Audit created', audit);
});

export const update = asyncHandler(async (req, res) => {
  const audit = await auditsService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Audit updated', audit);
});

export const remove = asyncHandler(async (req, res) => {
  await auditsService.remove(req.params.id);
  return sendSuccess(res, 200, 'Audit deleted');
});
