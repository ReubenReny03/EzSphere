import mongoose from 'mongoose';
import { AUDIT_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const auditSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    auditor: { type: String, trim: true },
    date: { type: Date, required: true },
    findingsCount: { type: Number, default: 0, min: 0 },
    findings: { type: String, trim: true },
    status: { type: String, enum: AUDIT_STATUSES, default: 'Scheduled' },
  },
  { timestamps: true },
);

auditSchema.index({ department: 1 });

export const Audit = mongoose.model('Audit', auditSchema);
