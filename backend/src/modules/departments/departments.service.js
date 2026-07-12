import { Department } from '../../models/Department.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Department.find(filter)
      .populate('head', 'name email')
      .populate('parentDepartment', 'name code')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Department.countDocuments(filter),
  ]);

  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const dept = await Department.findById(id).populate('head', 'name email').populate('parentDepartment', 'name code');
  if (!dept) throw new AppError(404, 'Department not found');
  return dept;
};

export const create = async (data) => Department.create(data);

export const update = async (id, data) => {
  const dept = await Department.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!dept) throw new AppError(404, 'Department not found');
  return dept;
};

export const remove = async (id) => {
  const dept = await Department.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!dept) throw new AppError(404, 'Department not found');
  return dept;
};
