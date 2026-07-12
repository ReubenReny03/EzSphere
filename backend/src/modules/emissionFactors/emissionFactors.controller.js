import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as emissionFactorsService from './emissionFactors.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await emissionFactorsService.list(req.query);
  return sendSuccess(res, 200, 'Emission factors fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const factor = await emissionFactorsService.getById(req.params.id);
  return sendSuccess(res, 200, 'Emission factor fetched', factor);
});

export const create = asyncHandler(async (req, res) => {
  const factor = await emissionFactorsService.create(req.body);
  return sendSuccess(res, 201, 'Emission factor created', factor);
});

export const update = asyncHandler(async (req, res) => {
  const factor = await emissionFactorsService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Emission factor updated', factor);
});

export const remove = asyncHandler(async (req, res) => {
  await emissionFactorsService.remove(req.params.id);
  return sendSuccess(res, 200, 'Emission factor deactivated');
});
