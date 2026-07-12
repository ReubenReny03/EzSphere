import mongoose from 'mongoose';
import { POLICY_CATEGORIES, STATUS_ACTIVE_INACTIVE } from '../utils/constants.js';

const { Schema } = mongoose;

const esgPolicySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: POLICY_CATEGORIES, required: true },
    description: { type: String, trim: true },
    version: { type: String, default: '1.0' },
    effectiveDate: { type: Date, required: true },
    requiresAcknowledgement: { type: Boolean, default: true },
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

esgPolicySchema.index({ category: 1 });

export const ESGPolicy = mongoose.model('ESGPolicy', esgPolicySchema);
