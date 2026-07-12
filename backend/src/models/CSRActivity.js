import mongoose from 'mongoose';
import { CSR_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const csrActivitySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, trim: true },
    evidenceRequired: { type: Boolean, default: false },
    date: { type: Date, required: true },
    capacity: { type: Number, min: 0 },
    joinedCount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: CSR_STATUSES, default: 'Open' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

csrActivitySchema.index({ status: 1 });

// joinedCount is denormalized (documented exception, §2) — kept correct via
// modules/csr's join/approval service methods calling this static.
csrActivitySchema.statics.recomputeJoinedCount = async function recomputeJoinedCount(activityId) {
  const EmployeeParticipation = mongoose.model('EmployeeParticipation');
  const count = await EmployeeParticipation.countDocuments({ activity: activityId });
  await this.findByIdAndUpdate(activityId, { joinedCount: count });
  return count;
};

export const CSRActivity = mongoose.model('CSRActivity', csrActivitySchema);
