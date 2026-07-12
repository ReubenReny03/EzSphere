import mongoose from 'mongoose';

const { Schema } = mongoose;

const departmentScoreSchema = new Schema(
  {
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    period: { type: String, required: true }, // e.g. "2026-Q3"
    environmentalScore: { type: Number, default: 0, min: 0, max: 100 },
    socialScore: { type: Number, default: 0, min: 0, max: 100 },
    governanceScore: { type: Number, default: 0, min: 0, max: 100 },
    totalScore: { type: Number, default: 0, min: 0, max: 100 },
    computedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

departmentScoreSchema.index({ department: 1, period: 1 }, { unique: true });

export const DepartmentScore = mongoose.model('DepartmentScore', departmentScoreSchema);
