import mongoose from 'mongoose';
import { ACTIVITY_TYPES, STATUS_ACTIVE_INACTIVE } from '../utils/constants.js';

const { Schema } = mongoose;

const emissionFactorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    activityType: { type: String, enum: ACTIVITY_TYPES, required: true },
    unit: { type: String, required: true, trim: true }, // e.g. "kgCO2/L"
    value: { type: Number, required: true, min: 0 },
    source: { type: String, trim: true },
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

emissionFactorSchema.index({ activityType: 1 });

export const EmissionFactor = mongoose.model('EmissionFactor', emissionFactorSchema);
