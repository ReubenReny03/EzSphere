import { Audit } from '../../models/Audit.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';
import { computeDepartmentScore } from '../../services/scoreEngine.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.department) filter.department = query.department;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Audit.find(filter).populate('department', 'name code').sort({ date: -1 }).skip(skip).limit(limit).lean(),
    Audit.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const audit = await Audit.findById(id).populate('department', 'name code');
  if (!audit) throw new AppError(404, 'Audit not found');
  return audit;
};

export const create = async (data) => {
  const audit = await Audit.create(data);
  await computeDepartmentScore(audit.department);
  return audit;
};

export const update = async (id, data) => {
  const audit = await Audit.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!audit) throw new AppError(404, 'Audit not found');
  await computeDepartmentScore(audit.department);
  return audit;
};

export const remove = async (id) => {
  const audit = await Audit.findByIdAndDelete(id);
  if (!audit) throw new AppError(404, 'Audit not found');
  await computeDepartmentScore(audit.department);
  return audit;
};
