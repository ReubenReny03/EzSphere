import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as categoriesService from './categories.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await categoriesService.list(req.query);
  return sendSuccess(res, 200, 'Categories fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const category = await categoriesService.getById(req.params.id);
  return sendSuccess(res, 200, 'Category fetched', category);
});

export const create = asyncHandler(async (req, res) => {
  const category = await categoriesService.create(req.body);
  return sendSuccess(res, 201, 'Category created', category);
});

export const update = asyncHandler(async (req, res) => {
  const category = await categoriesService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Category updated', category);
});

export const remove = asyncHandler(async (req, res) => {
  await categoriesService.remove(req.params.id);
  return sendSuccess(res, 200, 'Category deactivated');
});
