import mongoose from 'mongoose';
import { STATUS_ACTIVE_INACTIVE } from '../utils/constants.js';

const { Schema } = mongoose;

const productESGProfileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', index: true },
    carbonFootprint: { type: Number, default: 0, min: 0 },
    recyclablePct: { type: Number, default: 0, min: 0, max: 100 },
    ethicalSourcingScore: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

productESGProfileSchema.index({ sku: 1 }, { unique: true });
productESGProfileSchema.index({ department: 1 });

export const ProductESGProfile = mongoose.model('ProductESGProfile', productESGProfileSchema);
