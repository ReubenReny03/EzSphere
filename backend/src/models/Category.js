import mongoose from 'mongoose';
import { CATEGORY_TYPES, STATUS_ACTIVE_INACTIVE } from '../utils/constants.js';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: CATEGORY_TYPES, required: true },
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

categorySchema.index({ name: 1, type: 1 }, { unique: true });

export const Category = mongoose.model('Category', categorySchema);
