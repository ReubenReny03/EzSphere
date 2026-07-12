import mongoose from 'mongoose';
import { STATUS_ACTIVE_INACTIVE, DEFAULT_EMISSION_BUDGET } from '../utils/constants.js';

const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    head: { type: Schema.Types.ObjectId, ref: 'User' },
    parentDepartment: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    employeeCount: { type: Number, default: 0, min: 0 },
    // scoreEngine inputs not otherwise modeled (§3): diversity is seeded/
    // configurable per department, emissionBudget is the per-period CO2 target.
    diversityScore: { type: Number, default: 70, min: 0, max: 100 },
    emissionBudget: { type: Number, default: DEFAULT_EMISSION_BUDGET, min: 0 },
    status: { type: String, enum: STATUS_ACTIVE_INACTIVE, default: 'active' },
  },
  { timestamps: true },
);

departmentSchema.index({ code: 1 }, { unique: true });
departmentSchema.index({ parentDepartment: 1 });

// employeeCount is denormalized (documented exception, §2) — kept correct by
// recomputing whenever a User's department changes, see modules/departments/*.service.js
departmentSchema.statics.recomputeEmployeeCount = async function recomputeEmployeeCount(deptId) {
  const User = mongoose.model('User');
  const count = await User.countDocuments({ department: deptId, status: 'active' });
  await this.findByIdAndUpdate(deptId, { employeeCount: count });
  return count;
};

export const Department = mongoose.model('Department', departmentSchema);
