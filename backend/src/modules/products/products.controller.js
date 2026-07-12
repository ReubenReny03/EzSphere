import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as productsService from './products.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await productsService.list(req.query);
  return sendSuccess(res, 200, 'Product ESG profiles fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const product = await productsService.getById(req.params.id);
  return sendSuccess(res, 200, 'Product ESG profile fetched', product);
});

export const create = asyncHandler(async (req, res) => {
  const product = await productsService.create(req.body);
  return sendSuccess(res, 201, 'Product ESG profile created', product);
});

export const update = asyncHandler(async (req, res) => {
  const product = await productsService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Product ESG profile updated', product);
});

export const remove = asyncHandler(async (req, res) => {
  await productsService.remove(req.params.id);
  return sendSuccess(res, 200, 'Product ESG profile deactivated');
});
