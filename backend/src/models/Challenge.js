import mongoose from 'mongoose';
import { CHALLENGE_DIFFICULTIES, CHALLENGE_STATUSES } from '../utils/constants.js';

const { Schema } = mongoose;

const challengeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, trim: true },
    xp: { type: Number, default: 0, min: 0 },
    difficulty: { type: String, enum: CHALLENGE_DIFFICULTIES, required: true },
    evidenceRequired: { type: Boolean, default: false },
    deadline: { type: Date, required: true },
    status: { type: String, enum: CHALLENGE_STATUSES, default: 'Draft', index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

challengeSchema.index({ status: 1 });
challengeSchema.index({ deadline: 1 });

export const Challenge = mongoose.model('Challenge', challengeSchema);
