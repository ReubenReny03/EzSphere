import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as challengesService from './challenges.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await challengesService.list(req.query);
  return sendSuccess(res, 200, 'Challenges fetched', items, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const challenge = await challengesService.getById(req.params.id);
  return sendSuccess(res, 200, 'Challenge fetched', challenge);
});

export const create = asyncHandler(async (req, res) => {
  const challenge = await challengesService.create(req.body, req.user.id);
  return sendSuccess(res, 201, 'Challenge created', challenge);
});

export const update = asyncHandler(async (req, res) => {
  const challenge = await challengesService.update(req.params.id, req.body);
  return sendSuccess(res, 200, 'Challenge updated', challenge);
});

export const setStatus = asyncHandler(async (req, res) => {
  const challenge = await challengesService.setStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Challenge status updated', challenge);
});

export const join = asyncHandler(async (req, res) => {
  const participation = await challengesService.join(req.params.id, req.user.id);
  return sendSuccess(res, 201, 'Joined challenge', participation);
});

export const listParticipation = asyncHandler(async (req, res) => {
  const { items, meta } = await challengesService.listParticipation(req.query);
  return sendSuccess(res, 200, 'Challenge participation fetched', items, meta);
});

export const updateProgress = asyncHandler(async (req, res) => {
  const participation = await challengesService.updateProgress(req.params.id, req.user.id, req.body.progress);
  return sendSuccess(res, 200, 'Progress updated', participation);
});

export const approveParticipation = asyncHandler(async (req, res) => {
  const participation = await challengesService.approveParticipation(req.params.id);
  return sendSuccess(res, 200, 'Participation approved', participation);
});

export const rejectParticipation = asyncHandler(async (req, res) => {
  const participation = await challengesService.rejectParticipation(req.params.id);
  return sendSuccess(res, 200, 'Participation rejected', participation);
});
