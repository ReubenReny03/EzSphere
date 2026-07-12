import mongoose from 'mongoose';
import { GOAL_METRICS, GOAL_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const environmentalGoalSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    metric: { type: String, enum: GOAL_METRICS, required: true },
    targetValue: { type: Number, required: true, min: 0 },
    currentValue: { type: Number, default: 0, min: 0 },
    unit: { type: String, trim: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: GOAL_STATUSES, default: 'Active', index: true },
  },
  { timestamps: true },
);

environmentalGoalSchema.index({ department: 1 });
environmentalGoalSchema.index({ status: 1 });

environmentalGoalSchema.virtual('progress').get(function progress() {
  if (!this.targetValue) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

environmentalGoalSchema.set('toJSON', { virtuals: true });
environmentalGoalSchema.set('toObject', { virtuals: true });

export const EnvironmentalGoal = mongoose.model('EnvironmentalGoal', environmentalGoalSchema);
