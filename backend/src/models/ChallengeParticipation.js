import mongoose from 'mongoose';
import { APPROVAL_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const challengeParticipationSchema = new Schema(
  {
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
    employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    proof: { type: String, trim: true },
    approvalStatus: { type: String, enum: APPROVAL_STATUSES, default: 'Pending', index: true },
    xpAwarded: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

challengeParticipationSchema.index({ challenge: 1, employee: 1 }, { unique: true });
challengeParticipationSchema.index({ approvalStatus: 1 });

export const ChallengeParticipation = mongoose.model(
  'ChallengeParticipation',
  challengeParticipationSchema,
);
