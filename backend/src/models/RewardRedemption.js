import mongoose from 'mongoose';
import { REDEMPTION_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const rewardRedemptionSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reward: { type: Schema.Types.ObjectId, ref: 'Reward', required: true },
    pointsSpent: { type: Number, required: true, min: 0 },
    status: { type: String, enum: REDEMPTION_STATUSES, default: 'Pending' },
    redeemedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

rewardRedemptionSchema.index({ employee: 1 });

export const RewardRedemption = mongoose.model('RewardRedemption', rewardRedemptionSchema);
