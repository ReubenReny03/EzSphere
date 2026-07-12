import mongoose from 'mongoose';

const { Schema } = mongoose;

const policyAcknowledgementSchema = new Schema(
  {
    policy: { type: Schema.Types.ObjectId, ref: 'ESGPolicy', required: true },
    employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    acknowledgedAt: { type: Date, default: Date.now },
    ipAddress: { type: String, trim: true },
  },
  { timestamps: true },
);

policyAcknowledgementSchema.index({ policy: 1, employee: 1 }, { unique: true });

export const PolicyAcknowledgement = mongoose.model(
  'PolicyAcknowledgement',
  policyAcknowledgementSchema,
);
