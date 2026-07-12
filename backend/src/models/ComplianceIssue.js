import mongoose from 'mongoose';
import { COMPLIANCE_SEVERITIES, COMPLIANCE_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const complianceIssueSchema = new Schema(
  {
    audit: { type: Schema.Types.ObjectId, ref: 'Audit', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    severity: { type: String, enum: COMPLIANCE_SEVERITIES, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    dueDate: { type: Date, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    status: { type: String, enum: COMPLIANCE_STATUSES, default: 'Open' },
  },
  { timestamps: true },
);

complianceIssueSchema.index({ status: 1, dueDate: 1 });
complianceIssueSchema.index({ owner: 1 });

complianceIssueSchema.virtual('isOverdue').get(function isOverdue() {
  return this.status !== 'Resolved' && this.dueDate < new Date();
});

complianceIssueSchema.set('toJSON', { virtuals: true });
complianceIssueSchema.set('toObject', { virtuals: true });

export const ComplianceIssue = mongoose.model('ComplianceIssue', complianceIssueSchema);
