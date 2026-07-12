import mongoose from 'mongoose';
import { STATUS_ACTIVE_INACTIVE } from '../utils/constants.js';

const { Schema } = mongoose;

const rewardSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    pointsRequired: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

rewardSchema.index({ status: 1 });

export const Reward = mongoose.model('Reward', rewardSchema);
