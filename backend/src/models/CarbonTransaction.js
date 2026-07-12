import mongoose from 'mongoose';
import { ACTIVITY_TYPES } from '../utils/constants.js';

const { Schema } = mongoose;

const carbonTransactionSchema = new Schema(
  {
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    sourceType: { type: String, enum: ACTIVITY_TYPES, required: true },
    sourceRef: { type: String, trim: true },
    activityData: { type: Number, required: true, min: 0 }, // quantity
    emissionFactor: { type: Schema.Types.ObjectId, ref: 'EmissionFactor', required: true },
    co2Amount: { type: Number, min: 0 }, // computed = activityData * factor.value
    date: { type: Date, required: true, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

carbonTransactionSchema.index({ department: 1, date: -1 });
carbonTransactionSchema.index({ sourceType: 1 });
carbonTransactionSchema.index({ date: 1 });

carbonTransactionSchema.pre('validate', async function computeCO2(next) {
  if (this.isModified('activityData') || this.isModified('emissionFactor') || this.isNew) {
    const EmissionFactor = mongoose.model('EmissionFactor');
    const factor = await EmissionFactor.findById(this.emissionFactor).lean();
    if (factor) this.co2Amount = this.activityData * factor.value;
  }
  return next();
});

export const CarbonTransaction = mongoose.model('CarbonTransaction', carbonTransactionSchema);
