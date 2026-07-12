import { Badge } from '../../models/Badge.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Badge.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Badge.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const badge = await Badge.findById(id);
  if (!badge) throw new AppError(404, 'Badge not found');
  return badge;
};

export const create = async (data) => Badge.create(data);

export const update = async (id, data) => {
  const badge = await Badge.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!badge) throw new AppError(404, 'Badge not found');
  return badge;
};

export const remove = async (id) => {
  const badge = await Badge.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!badge) throw new AppError(404, 'Badge not found');
  return badge;
};
