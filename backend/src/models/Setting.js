import mongoose from 'mongoose';
import { DEFAULT_ESG_WEIGHTS } from '../utils/constants.js';

const { Schema } = mongoose;

const esgWeightsSchema = new Schema(
  {
    environmental: { type: Number, default: DEFAULT_ESG_WEIGHTS.environmental, min: 0, max: 1 },
    social: { type: Number, default: DEFAULT_ESG_WEIGHTS.social, min: 0, max: 1 },
    governance: { type: Number, default: DEFAULT_ESG_WEIGHTS.governance, min: 0, max: 1 },
  },
  { _id: false },
);

const flagsSchema = new Schema(
  {
    autoEmissionCalc: { type: Boolean, default: true },
    evidenceRequired: { type: Boolean, default: true },
    autoAwardBadges: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: false },
    notifyNewCompliance: { type: Boolean, default: true },
    notifyApproval: { type: Boolean, default: true },
    notifyPolicyReminder: { type: Boolean, default: true },
    notifyBadgeUnlock: { type: Boolean, default: true },
  },
  { _id: false },
);

const settingSchema = new Schema(
  {
    key: { type: String, default: 'global', unique: true },
    esgWeights: { type: esgWeightsSchema, default: () => ({}) },
    flags: { type: flagsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

settingSchema.statics.getGlobal = async function getGlobal() {
  let setting = await this.findOne({ key: 'global' });
  if (!setting) setting = await this.create({ key: 'global' });
  return setting;
};

export const Setting = mongoose.model('Setting', settingSchema);
