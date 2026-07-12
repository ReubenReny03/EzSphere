import { EnvironmentalGoal } from '../../models/EnvironmentalGoal.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';
import { computeDepartmentScore } from '../../services/scoreEngine.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.department) filter.department = query.department;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    EnvironmentalGoal.find(filter)
      .populate('department', 'name code')
      .sort({ deadline: 1 })
      .skip(skip)
      .limit(limit),
    EnvironmentalGoal.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const goal = await EnvironmentalGoal.findById(id).populate('department', 'name code');
  if (!goal) throw new AppError(404, 'Goal not found');
  return goal;
};

export const create = async (data) => {
  const goal = await EnvironmentalGoal.create(data);
  await computeDepartmentScore(goal.department);
  return goal;
};

export const update = async (id, data) => {
  const goal = await EnvironmentalGoal.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!goal) throw new AppError(404, 'Goal not found');
  await computeDepartmentScore(goal.department);
  return goal;
};

export const remove = async (id) => {
  const goal = await EnvironmentalGoal.findByIdAndDelete(id);
  if (!goal) throw new AppError(404, 'Goal not found');
  await computeDepartmentScore(goal.department);
  return goal;
};
