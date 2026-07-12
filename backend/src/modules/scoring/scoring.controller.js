import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as scoringService from './scoring.service.js';

export const overview = asyncHandler(async (req, res) => {
  const overall = await scoringService.getOverview();
  return sendSuccess(res, 200, 'ESG overview fetched', overall);
});

export const departments = asyncHandler(async (req, res) => {
  const ranking = await scoringService.getDepartmentRanking();
  return sendSuccess(res, 200, 'Department ranking fetched', ranking);
});

export const recompute = asyncHandler(async (req, res) => {
  const count = await scoringService.recomputeAll();
  return sendSuccess(res, 200, 'Scores recomputed', { count });
});
