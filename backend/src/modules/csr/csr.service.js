import { CSRActivity } from '../../models/CSRActivity.js';
import { EmployeeParticipation } from '../../models/EmployeeParticipation.js';
import { User } from '../../models/User.js';
import { Setting } from '../../models/Setting.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';
import { CSR_POINTS_PER_ACTIVITY } from '../../utils/constants.js';
import { evaluateAndAwardBadges } from '../../services/badgeEngine.js';
import { computeDepartmentScore } from '../../services/scoreEngine.js';
import { notify } from '../../services/notify.js';
import { getIO } from '../../config/socket.js';
import { SOCKET_EVENTS } from '../../sockets/events.js';
import { logger } from '../../utils/logger.js';

export const listActivities = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;

  const [items, total] = await Promise.all([
    CSRActivity.find(filter).populate('category', 'name').sort({ date: -1 }).skip(skip).limit(limit).lean(),
    CSRActivity.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getActivityById = async (id) => {
  const activity = await CSRActivity.findById(id).populate('category', 'name');
  if (!activity) throw new AppError(404, 'CSR activity not found');
  return activity;
};

export const createActivity = async (data, userId) => CSRActivity.create({ ...data, createdBy: userId });

export const updateActivity = async (id, data) => {
  const activity = await CSRActivity.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!activity) throw new AppError(404, 'CSR activity not found');
  return activity;
};

export const removeActivity = async (id) => {
  const activity = await CSRActivity.findByIdAndUpdate(id, { status: 'Closed' }, { new: true });
  if (!activity) throw new AppError(404, 'CSR activity not found');
  return activity;
};

export const joinActivity = async (activityId, employeeId, proof) => {
  const activity = await CSRActivity.findById(activityId);
  if (!activity) throw new AppError(404, 'CSR activity not found');
  if (activity.status !== 'Open') throw new AppError(409, 'Activity is not open for joining');
  if (activity.capacity && activity.joinedCount >= activity.capacity) {
    throw new AppError(409, 'Activity is at capacity');
  }

  const existing = await EmployeeParticipation.findOne({ employee: employeeId, activity: activityId });
  if (existing) throw new AppError(409, 'You have already joined this activity');

  const participation = await EmployeeParticipation.create({
    employee: employeeId,
    activity: activityId,
    proof,
  });

  await CSRActivity.recomputeJoinedCount(activityId);

  try {
    getIO().to('role:manager').to('role:admin').emit(SOCKET_EVENTS.APPROVAL_NEW, participation);
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping APPROVAL_NEW emit');
  }

  return participation;
};

export const listParticipationQueue = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { approvalStatus: query.status || 'Pending' };

  const [items, total] = await Promise.all([
    EmployeeParticipation.find(filter)
      .populate('employee', 'name email department')
      .populate('activity', 'title evidenceRequired')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    EmployeeParticipation.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const reviewParticipation = async (participationId, decision, reviewerId) => {
  const participation = await EmployeeParticipation.findById(participationId).populate('activity');
  if (!participation) throw new AppError(404, 'Participation not found');
  if (participation.approvalStatus !== 'Pending') {
    throw new AppError(409, 'Participation has already been reviewed');
  }

  if (decision === 'Approved') {
    const settings = await Setting.getGlobal();
    const requiresEvidence = settings.flags.evidenceRequired && participation.activity.evidenceRequired;
    if (requiresEvidence && !participation.proof) {
      throw new AppError(422, 'Evidence is required before this participation can be approved');
    }

    participation.pointsEarned = CSR_POINTS_PER_ACTIVITY;
    participation.completionDate = new Date();

    const employee = await User.findByIdAndUpdate(
      participation.employee,
      { $inc: { pointsBalance: CSR_POINTS_PER_ACTIVITY, csrCount: 1 } },
      { new: true },
    );

    await evaluateAndAwardBadges(employee._id);
    if (employee.department) await computeDepartmentScore(employee.department);
  }

  participation.approvalStatus = decision;
  participation.reviewedBy = reviewerId;
  await participation.save();

  await notify({
    recipientId: participation.employee,
    type: 'APPROVAL_DECISION',
    title: `CSR participation ${decision.toLowerCase()}`,
    message: `Your participation in "${participation.activity.title}" was ${decision.toLowerCase()}.`,
    related: { kind: 'EmployeeParticipation', id: participation._id },
  });

  return participation;
};
