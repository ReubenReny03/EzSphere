import { CarbonTransaction } from '../../models/CarbonTransaction.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';
import { generateCarbonTransaction } from '../../services/emissionEngine.js';
import { getIO } from '../../config/socket.js';
import { SOCKET_EVENTS } from '../../sockets/events.js';
import { logger } from '../../utils/logger.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.department) filter.department = query.department;
  if (query.sourceType) filter.sourceType = query.sourceType;

  const [items, total] = await Promise.all([
    CarbonTransaction.find(filter)
      .populate('department', 'name code')
      .populate('emissionFactor', 'name unit value')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CarbonTransaction.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const txn = await CarbonTransaction.findById(id)
    .populate('department', 'name code')
    .populate('emissionFactor', 'name unit value');
  if (!txn) throw new AppError(404, 'Carbon transaction not found');
  return txn;
};

export const create = async (data, userId) => {
  const txn = await CarbonTransaction.create({ ...data, createdBy: userId });
  try {
    getIO().emit(SOCKET_EVENTS.CARBON_NEW, txn);
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping CARBON_NEW emit');
  }
  return txn;
};

export const generate = async (data, userId) => generateCarbonTransaction({ ...data, createdBy: userId });

export const getTrend = async (months = 12) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  return CarbonTransaction.aggregate([
    { $match: { date: { $gte: since } } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        totalCO2: { $sum: '$co2Amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
};

export const getByDepartment = async () =>
  CarbonTransaction.aggregate([
    {
      $group: { _id: '$department', totalCO2: { $sum: '$co2Amount' } },
    },
    {
      $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' },
    },
    { $unwind: '$department' },
    {
      $project: {
        _id: 0,
        department: { _id: '$department._id', name: '$department.name', code: '$department.code' },
        totalCO2: 1,
      },
    },
    { $sort: { totalCO2: -1 } },
  ]);
