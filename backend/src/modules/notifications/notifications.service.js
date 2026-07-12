import { Notification } from '../../models/Notification.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';

export const listMine = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { recipient: userId };
  if (query.read !== undefined) filter.read = query.read === 'true';

  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const markRead = async (id, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: userId },
    { read: true },
    { new: true },
  );
  if (!notification) throw new AppError(404, 'Notification not found');
  return notification;
};

export const markAllRead = async (userId) => {
  const result = await Notification.updateMany({ recipient: userId, read: false }, { read: true });
  return result.modifiedCount;
};
