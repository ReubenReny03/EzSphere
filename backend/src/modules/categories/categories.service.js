import { Category } from '../../models/Category.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Category.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Category.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(404, 'Category not found');
  return category;
};

export const create = async (data) => Category.create(data);

export const update = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw new AppError(404, 'Category not found');
  return category;
};

export const remove = async (id) => {
  const category = await Category.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!category) throw new AppError(404, 'Category not found');
  return category;
};
