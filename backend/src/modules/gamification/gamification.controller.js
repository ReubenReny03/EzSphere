import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as gamificationService from './gamification.service.js';

export const leaderboard = asyncHandler(async (req, res) => {
  const board = await gamificationService.getLeaderboard(req.query);
  return sendSuccess(res, 200, 'Leaderboard fetched', board);
});

export const redeem = asyncHandler(async (req, res) => {
  const redemption = await gamificationService.redeemReward(req.params.id, req.user.id);
  return sendSuccess(res, 201, 'Reward redeemed', redemption);
});
