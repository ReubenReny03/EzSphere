import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as policiesService from './policies.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await policiesService.list(req.query);
  return sendSuccess(res, 200, 'Policies fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const policy = await policiesService.getById(req.params.id);
  return sendSuccess(res, 200, 'Policy fetched', policy);
});

export const create = asyncHandler(async (req, res) => {
  const policy = await policiesService.create(req.body);
  return sendSuccess(res, 201, 'Policy created', policy);
});

export const update = asyncHandler(async (req, res) => {
  const policy = await policiesService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Policy updated', policy);
});

export const remove = asyncHandler(async (req, res) => {
  await policiesService.remove(req.params.id);
  return sendSuccess(res, 200, 'Policy deactivated');
});

export const acknowledge = asyncHandler(async (req, res) => {
  const ack = await policiesService.acknowledge(req.params.id, req.user.id, req.ip);
  return sendSuccess(res, 201, 'Policy acknowledged', ack);
});

export const listAcknowledgements = asyncHandler(async (req, res) => {
  const { items, meta } = await policiesService.listAcknowledgements(req.query);
  return sendSuccess(res, 200, 'Acknowledgements fetched', items, meta);
});
