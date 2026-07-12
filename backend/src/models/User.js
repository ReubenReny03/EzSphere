import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, STATUS_ACTIVE_INACTIVE } from '../utils/constants.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.EMPLOYEE, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', index: true },
    title: { type: String, trim: true },
    xp: { type: Number, default: 0, min: 0 },
    pointsBalance: { type: Number, default: 0, min: 0 },
    challengesCompleted: { type: Number, default: 0, min: 0 },
    csrCount: { type: Number, default: 0, min: 0 },
    trainingCompleted: { type: Boolean, default: false },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ department: 1 });
userSchema.index({ xp: -1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
