import { Reward } from '../../models/Reward.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Reward.find(filter).sort({ pointsRequired: 1 }).skip(skip).limit(limit).lean(),
    Reward.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const reward = await Reward.findById(id);
  if (!reward) throw new AppError(404, 'Reward not found');
  return reward;
};

export const create = async (data) => Reward.create(data);

export const update = async (id, data) => {
  const reward = await Reward.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!reward) throw new AppError(404, 'Reward not found');
  return reward;
};

export const remove = async (id) => {
  const reward = await Reward.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!reward) throw new AppError(404, 'Reward not found');
  return reward;
};
