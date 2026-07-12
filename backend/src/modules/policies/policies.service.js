import { ESGPolicy } from '../../models/ESGPolicy.js';
import { PolicyAcknowledgement } from '../../models/PolicyAcknowledgement.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    ESGPolicy.find(filter).sort({ effectiveDate: -1 }).skip(skip).limit(limit).lean(),
    ESGPolicy.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const policy = await ESGPolicy.findById(id);
  if (!policy) throw new AppError(404, 'Policy not found');
  return policy;
};

export const create = async (data) => ESGPolicy.create(data);

export const update = async (id, data) => {
  const policy = await ESGPolicy.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!policy) throw new AppError(404, 'Policy not found');
  return policy;
};

export const remove = async (id) => {
  const policy = await ESGPolicy.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!policy) throw new AppError(404, 'Policy not found');
  return policy;
};

export const acknowledge = async (policyId, employeeId, ipAddress) => {
  const policy = await ESGPolicy.findById(policyId);
  if (!policy) throw new AppError(404, 'Policy not found');

  const existing = await PolicyAcknowledgement.findOne({ policy: policyId, employee: employeeId });
  if (existing) return existing;

  return PolicyAcknowledgement.create({ policy: policyId, employee: employeeId, ipAddress });
};

export const listAcknowledgements = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.policy) filter.policy = query.policy;
  if (query.employee) filter.employee = query.employee;

  const [items, total] = await Promise.all([
    PolicyAcknowledgement.find(filter)
      .populate('policy', 'title category')
      .populate('employee', 'name email department')
      .sort({ acknowledgedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PolicyAcknowledgement.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};
