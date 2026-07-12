import mongoose from 'mongoose';
import { APPROVAL_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const employeeParticipationSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activity: { type: Schema.Types.ObjectId, ref: 'CSRActivity', required: true },
    proof: { type: String, trim: true }, // multer path
    approvalStatus: { type: String, enum: APPROVAL_STATUSES, default: 'Pending', index: true },
    pointsEarned: { type: Number, default: 0, min: 0 },
    completionDate: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

employeeParticipationSchema.index({ employee: 1, activity: 1 }, { unique: true });
employeeParticipationSchema.index({ approvalStatus: 1 });

export const EmployeeParticipation = mongoose.model(
  'EmployeeParticipation',
  employeeParticipationSchema,
);
