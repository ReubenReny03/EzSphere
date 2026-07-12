import { ComplianceIssue } from '../../models/ComplianceIssue.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildMeta } from '../../utils/paginate.js';
import { computeDepartmentScore } from '../../services/scoreEngine.js';
import { notify } from '../../services/notify.js';

export const list = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.severity) filter.severity = query.severity;
  if (query.overdue === 'true') {
    filter.status = { $ne: 'Resolved' };
    filter.dueDate = { $lt: new Date() };
  }

  const [items, total] = await Promise.all([
    ComplianceIssue.find(filter)
      .populate('owner', 'name email')
      .populate('department', 'name code')
      .populate('audit', 'title')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit),
    ComplianceIssue.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
};

export const getById = async (id) => {
  const issue = await ComplianceIssue.findById(id)
    .populate('owner', 'name email')
    .populate('department', 'name code')
    .populate('audit', 'title');
  if (!issue) throw new AppError(404, 'Compliance issue not found');
  return issue;
};

export const create = async (data) => {
  const issue = await ComplianceIssue.create(data);

  await notify({
    recipientId: issue.owner,
    type: 'COMPLIANCE_ISSUE',
    title: 'New compliance issue assigned',
    message: `"${issue.title}" (${issue.severity}) is due ${issue.dueDate.toDateString()}.`,
    related: { kind: 'ComplianceIssue', id: issue._id },
  });

  if (issue.department) await computeDepartmentScore(issue.department);
  return issue;
};

export const update = async (id, data) => {
  const issue = await ComplianceIssue.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!issue) throw new AppError(404, 'Compliance issue not found');
  if (issue.department) await computeDepartmentScore(issue.department);
  return issue;
};

export const remove = async (id) => {
  const issue = await ComplianceIssue.findByIdAndDelete(id);
  if (!issue) throw new AppError(404, 'Compliance issue not found');
  if (issue.department) await computeDepartmentScore(issue.department);
  return issue;
};
