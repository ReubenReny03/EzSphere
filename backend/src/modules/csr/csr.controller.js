import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as csrService from './csr.service.js';

export const listActivities = asyncHandler(async (req, res) => {
  const { items, meta } = await csrService.listActivities(req.query);
  return sendSuccess(res, 200, 'CSR activities fetched', items, meta);
});

export const getActivityById = asyncHandler(async (req, res) => {
  const activity = await csrService.getActivityById(req.params.id);
  return sendSuccess(res, 200, 'CSR activity fetched', activity);
});

export const createActivity = asyncHandler(async (req, res) => {
  const activity = await csrService.createActivity(req.body, req.user.id);
  return sendSuccess(res, 201, 'CSR activity created', activity);
});

export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await csrService.updateActivity(req.params.id, req.body);
  return sendSuccess(res, 200, 'CSR activity updated', activity);
});

export const removeActivity = asyncHandler(async (req, res) => {
  await csrService.removeActivity(req.params.id);
  return sendSuccess(res, 200, 'CSR activity closed');
});

export const join = asyncHandler(async (req, res) => {
  // multer's file.path uses the OS separator (backslashes on Windows), which
  // would corrupt the URL this gets served at (/uploads/...) — normalize to
  // forward slashes so the stored path is a valid URL on any OS.
  const proof = req.file ? req.file.path.replace(/\\/g, '/') : undefined;
  const participation = await csrService.joinActivity(req.params.id, req.user.id, proof);
  return sendSuccess(res, 201, 'Joined activity', participation);
});

export const queue = asyncHandler(async (req, res) => {
  const { items, meta } = await csrService.listParticipationQueue(req.query);
  return sendSuccess(res, 200, 'Participation queue fetched', items, meta);
});

export const approve = asyncHandler(async (req, res) => {
  const participation = await csrService.reviewParticipation(req.params.id, 'Approved', req.user.id);
  return sendSuccess(res, 200, 'Participation approved', participation);
});

export const reject = asyncHandler(async (req, res) => {
  const participation = await csrService.reviewParticipation(req.params.id, 'Rejected', req.user.id);
  return sendSuccess(res, 200, 'Participation rejected', participation);
});
