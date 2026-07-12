import { User } from '../../models/User.js';
import { Reward } from '../../models/Reward.js';
import { RewardRedemption } from '../../models/RewardRedemption.js';
import { AppError } from '../../utils/AppError.js';
import { notify } from '../../services/notify.js';
import { getIO } from '../../config/socket.js';
import { SOCKET_EVENTS } from '../../sockets/events.js';
import { logger } from '../../utils/logger.js';

export const getLeaderboard = async ({ scope = 'global', department, limit = 20 }) => {
  const filter = { status: 'active' };
  if (scope === 'department' && department) filter.department = department;

  return User.find(filter)
    .select('name email department xp badges')
    .populate('department', 'name code')
    .sort({ xp: -1 })
    .limit(Number(limit))
    .lean();
};

// Reward redemption (mandatory business rule): stock and balance are
// decremented with atomic conditional updates rather than a multi-document
// transaction, so this stays correct under concurrent requests even against
// a standalone (non-replica-set) MongoDB instance, which can't run transactions.
export const redeemReward = async (rewardId, userId) => {
  const reward = await Reward.findById(rewardId);
  if (!reward) throw new AppError(404, 'Reward not found');
  if (reward.status !== 'active') throw new AppError(409, 'Reward is not available');

  const stockDecremented = await Reward.findOneAndUpdate(
    { _id: rewardId, stock: { $gt: 0 } },
    { $inc: { stock: -1 } },
    { new: true },
  );
  if (!stockDecremented) throw new AppError(409, 'Reward is out of stock');

  const balanceDecremented = await User.findOneAndUpdate(
    { _id: userId, pointsBalance: { $gte: reward.pointsRequired } },
    { $inc: { pointsBalance: -reward.pointsRequired } },
    { new: true },
  );

  if (!balanceDecremented) {
    await Reward.findByIdAndUpdate(rewardId, { $inc: { stock: 1 } }); // roll back stock
    throw new AppError(409, 'Insufficient points balance');
  }

  const redemption = await RewardRedemption.create({
    employee: userId,
    reward: rewardId,
    pointsSpent: reward.pointsRequired,
    status: 'Pending',
  });

  await notify({
    recipientId: userId,
    type: 'REWARD_REDEEMED',
    title: 'Reward redeemed',
    message: `You redeemed "${reward.name}" for ${reward.pointsRequired} points.`,
    related: { kind: 'RewardRedemption', id: redemption._id },
  });

  try {
    getIO().emit(SOCKET_EVENTS.LEADERBOARD_UPDATE, { userId });
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping LEADERBOARD_UPDATE emit');
  }

  return redemption;
};
