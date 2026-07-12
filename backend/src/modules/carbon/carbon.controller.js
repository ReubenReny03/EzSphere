import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as carbonService from './carbon.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await carbonService.list(req.query);
  return sendSuccess(res, 200, 'Carbon transactions fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const txn = await carbonService.getById(req.params.id);
  return sendSuccess(res, 200, 'Carbon transaction fetched', txn);
});

export const create = asyncHandler(async (req, res) => {
  const txn = await carbonService.create(req.body, req.user.id);
  return sendSuccess(res, 201, 'Carbon transaction created', txn);
});

export const generate = asyncHandler(async (req, res) => {
  const txn = await carbonService.generate(req.body, req.user.id);
  return sendSuccess(res, 201, 'Carbon transaction auto-generated', txn);
});

export const trend = asyncHandler(async (req, res) => {
  const data = await carbonService.getTrend(req.query.months || 12);
  return sendSuccess(res, 200, 'Emissions trend fetched', data);
});

export const byDepartment = asyncHandler(async (req, res) => {
  const data = await carbonService.getByDepartment();
  return sendSuccess(res, 200, 'Emissions by department fetched', data);
});
