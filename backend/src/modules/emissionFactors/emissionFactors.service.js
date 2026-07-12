import { EmissionFactor } from '../../models/EmissionFactor.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.activityType) filter.activityType = query.activityType;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    EmissionFactor.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    EmissionFactor.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const factor = await EmissionFactor.findById(id);
  if (!factor) throw new AppError(404, 'Emission factor not found');
  return factor;
};

export const create = async (data) => EmissionFactor.create(data);

export const update = async (id, data) => {
  const factor = await EmissionFactor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!factor) throw new AppError(404, 'Emission factor not found');
  return factor;
};

export const remove = async (id) => {
  const factor = await EmissionFactor.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!factor) throw new AppError(404, 'Emission factor not found');
  return factor;
};
