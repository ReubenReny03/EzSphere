import { Challenge } from '../../models/Challenge.js';
import { ChallengeParticipation } from '../../models/ChallengeParticipation.js';
import { User } from '../../models/User.js';
import { Setting } from '../../models/Setting.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';
import { evaluateAndAwardBadges } from '../../services/badgeEngine.js';
import { computeDepartmentScore } from '../../services/scoreEngine.js';
import { notify } from '../../services/notify.js';
import { getIO } from '../../config/socket.js';
import { SOCKET_EVENTS } from '../../sockets/events.js';
import { logger } from '../../utils/logger.js';

const TRANSITIONS = {
  Draft: ['Active', 'Archived'],
  Active: ['Under Review', 'Archived'],
  'Under Review': ['Completed', 'Archived'],
  Completed: ['Archived'],
  Archived: [],
};

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Challenge.find(filter).populate('category', 'name').sort({ deadline: 1 }).skip(skip).limit(limit).lean(),
    Challenge.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const challenge = await Challenge.findById(id).populate('category', 'name');
  if (!challenge) throw new AppError(404, 'Challenge not found');
  return challenge;
};

export const create = async (data, userId) => Challenge.create({ ...data, createdBy: userId });

export const update = async (id, data) => {
  const challenge = await Challenge.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!challenge) throw new AppError(404, 'Challenge not found');
  return challenge;
};

export const setStatus = async (id, nextStatus) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) throw new AppError(404, 'Challenge not found');

  const allowed = TRANSITIONS[challenge.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw new AppError(409, `Cannot transition challenge from "${challenge.status}" to "${nextStatus}"`);
  }

  challenge.status = nextStatus;
  await challenge.save();
  return challenge;
};

export const join = async (challengeId, employeeId) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) throw new AppError(404, 'Challenge not found');
  if (challenge.status !== 'Active') throw new AppError(409, 'Challenge is not currently active');

  const existing = await ChallengeParticipation.findOne({ challenge: challengeId, employee: employeeId });
  if (existing) throw new AppError(409, 'You have already joined this challenge');

  const participation = await ChallengeParticipation.create({ challenge: challengeId, employee: employeeId });

  try {
    getIO().to('role:manager').to('role:admin').emit(SOCKET_EVENTS.APPROVAL_NEW, participation);
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping APPROVAL_NEW emit');
  }

  return participation;
};

export const listParticipation = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { approvalStatus: query.status || 'Pending' };
  if (query.challenge) filter.challenge = query.challenge;

  const [items, total] = await Promise.all([
    ChallengeParticipation.find(filter)
      .populate('employee', 'name email department')
      .populate('challenge', 'title xp evidenceRequired')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ChallengeParticipation.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const updateProgress = async (participationId, employeeId, progress) => {
  const participation = await ChallengeParticipation.findOne({ _id: participationId, employee: employeeId });
  if (!participation) throw new AppError(404, 'Participation not found');
  participation.progress = progress;
  await participation.save();
  return participation;
};

export const approveParticipation = async (participationId) => {
  const participation = await ChallengeParticipation.findById(participationId).populate('challenge');
  if (!participation) throw new AppError(404, 'Participation not found');
  if (participation.approvalStatus !== 'Pending') {
    throw new AppError(409, 'Participation has already been reviewed');
  }

  const settings = await Setting.getGlobal();
  const requiresEvidence = settings.flags.evidenceRequired && participation.challenge.evidenceRequired;
  if (requiresEvidence && !participation.proof) {
    throw new AppError(422, 'Evidence is required before this participation can be approved');
  }

  participation.approvalStatus = 'Approved';
  participation.xpAwarded = participation.challenge.xp;
  await participation.save();

  const employee = await User.findByIdAndUpdate(
    participation.employee,
    { $inc: { xp: participation.challenge.xp, challengesCompleted: 1 } },
    { new: true },
  );

  await evaluateAndAwardBadges(employee._id);
  if (employee.department) await computeDepartmentScore(employee.department);

  try {
    getIO().emit(SOCKET_EVENTS.LEADERBOARD_UPDATE, { userId: employee._id });
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping LEADERBOARD_UPDATE emit');
  }

  await notify({
    recipientId: participation.employee,
    type: 'APPROVAL_DECISION',
    title: 'Challenge participation approved',
    message: `Your participation in "${participation.challenge.title}" was approved — +${participation.challenge.xp} XP.`,
    related: { kind: 'ChallengeParticipation', id: participation._id },
  });

  return participation;
};

export const rejectParticipation = async (participationId) => {
  const participation = await ChallengeParticipation.findById(participationId).populate('challenge');
  if (!participation) throw new AppError(404, 'Participation not found');
  if (participation.approvalStatus !== 'Pending') {
    throw new AppError(409, 'Participation has already been reviewed');
  }

  participation.approvalStatus = 'Rejected';
  await participation.save();

  await notify({
    recipientId: participation.employee,
    type: 'APPROVAL_DECISION',
    title: 'Challenge participation rejected',
    message: `Your participation in "${participation.challenge.title}" was rejected.`,
    related: { kind: 'ChallengeParticipation', id: participation._id },
  });

  return participation;
};
