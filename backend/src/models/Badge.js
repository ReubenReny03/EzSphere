import mongoose from 'mongoose';
import { BADGE_METRICS, STATUS_ACTIVE_INACTIVE } from '../utils/constants.js';

const { Schema } = mongoose;

const unlockRuleSchema = new Schema(
  {
    metric: { type: String, enum: BADGE_METRICS, required: true },
    threshold: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const badgeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    unlockRule: { type: unlockRuleSchema, required: true },
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

badgeSchema.index({ status: 1 });

export const Badge = mongoose.model('Badge', badgeSchema);
