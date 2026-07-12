import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as complianceService from './compliance.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await complianceService.list(req.query);
  return sendSuccess(res, 200, 'Compliance issues fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const issue = await complianceService.getById(req.params.id);
  return sendSuccess(res, 200, 'Compliance issue fetched', issue);
});

export const create = asyncHandler(async (req, res) => {
  const issue = await complianceService.create(req.body);
  return sendSuccess(res, 201, 'Compliance issue created', issue);
});

export const update = asyncHandler(async (req, res) => {
  const issue = await complianceService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Compliance issue updated', issue);
});

export const remove = asyncHandler(async (req, res) => {
  await complianceService.remove(req.params.id);
  return sendSuccess(res, 200, 'Compliance issue deleted');
});
