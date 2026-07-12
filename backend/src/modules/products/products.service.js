import { ProductESGProfile } from '../../models/ProductESGProfile.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.department) filter.department = query.department;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    ProductESGProfile.find(filter).populate('department', 'name code').sort({ name: 1 }).skip(skip).limit(limit).lean(),
    ProductESGProfile.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const product = await ProductESGProfile.findById(id).populate('department', 'name code');
  if (!product) throw new AppError(404, 'Product ESG profile not found');
  return product;
};

export const create = async (data) => ProductESGProfile.create(data);

export const update = async (id, data) => {
  const product = await ProductESGProfile.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!product) throw new AppError(404, 'Product ESG profile not found');
  return product;
};

export const remove = async (id) => {
  const product = await ProductESGProfile.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!product) throw new AppError(404, 'Product ESG profile not found');
  return product;
};
