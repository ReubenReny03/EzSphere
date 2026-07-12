import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as departmentsService from './departments.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await departmentsService.list(req.query);
  return sendSuccess(res, 200, 'Departments fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const dept = await departmentsService.getById(req.params.id);
  return sendSuccess(res, 200, 'Department fetched', dept);
});

export const create = asyncHandler(async (req, res) => {
  const dept = await departmentsService.create(req.body);
  return sendSuccess(res, 201, 'Department created', dept);
});

export const update = asyncHandler(async (req, res) => {
  const dept = await departmentsService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Department updated', dept);
});

export const remove = asyncHandler(async (req, res) => {
  await departmentsService.remove(req.params.id);
  return sendSuccess(res, 200, 'Department deactivated');
});
