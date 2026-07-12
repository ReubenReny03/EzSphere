import mongoose from 'mongoose';
import { Department } from '../../models/Department.js';
import { EnvironmentalGoal } from '../../models/EnvironmentalGoal.js';
import { CarbonTransaction } from '../../models/CarbonTransaction.js';
import { User } from '../../models/User.js';
import { EmployeeParticipation } from '../../models/EmployeeParticipation.js';
import { ESGPolicy } from '../../models/ESGPolicy.js';
import { PolicyAcknowledgement } from '../../models/PolicyAcknowledgement.js';
import { Audit } from '../../models/Audit.js';
import { ComplianceIssue } from '../../models/ComplianceIssue.js';
import { ChallengeParticipation } from '../../models/ChallengeParticipation.js';
import { DepartmentScore } from '../../models/DepartmentScore.js';
import { AppError } from '../../utils/AppError.js';
import { currentPeriod, getOverall } from '../../services/scoreEngine.js';
import { getDepartmentRanking } from '../scoring/scoring.service.js';

const deptFilter = async (departmentId) => {
  if (departmentId) {
    const dept = await Department.findById(departmentId).lean();
    if (!dept) throw new AppError(404, 'Department not found');
    return [dept];
  }
  return Department.find({ status: 'active' }).sort({ name: 1 }).lean();
};

export const getEnvironmentalReport = async ({ department, months = 12 }) => {
  const departments = await deptFilter(department);
  const period = currentPeriod();
  const scores = await DepartmentScore.find({ period }).lean();
  const scoreByDept = new Map(scores.map((s) => [s.department.toString(), s]));

  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const rows = await Promise.all(
    departments.map(async (dept) => {
      // Small per-department dataset at hackathon scale — plain find() + JS
      // average is simpler and equally correct here since `progress` is a
      // virtual (can't be aggregated in a Mongo pipeline without redefining
      // the formula in $project). Carbon totals below use real aggregation.
      const goals = await EnvironmentalGoal.find({ department: dept._id }).lean();
      const avgProgress = goals.length
        ? Math.round(
            goals.reduce((sum, g) => sum + Math.min(100, (g.currentValue / (g.targetValue || 1)) * 100), 0) /
              goals.length,
          )
        : 0;

      const [{ totalCO2 = 0 } = {}] = await CarbonTransaction.aggregate([
        { $match: { department: dept._id, date: { $gte: since } } },
        { $group: { _id: null, totalCO2: { $sum: '$co2Amount' } } },
      ]);

      return {
        departmentName: dept.name,
        departmentCode: dept.code,
        environmentalScore: Math.round(scoreByDept.get(dept._id.toString())?.environmentalScore ?? 0),
        goalCount: goals.length,
        avgGoalProgress: avgProgress,
        totalCO2: Math.round(totalCO2),
        emissionBudget: dept.emissionBudget,
      };
    }),
  );

  return {
    title: 'Environmental Report',
    columns: [
      { key: 'departmentName', label: 'Department' },
      { key: 'departmentCode', label: 'Code' },
      { key: 'environmentalScore', label: 'Env. Score' },
      { key: 'goalCount', label: 'Goals' },
      { key: 'avgGoalProgress', label: 'Avg Progress %' },
      { key: 'totalCO2', label: `CO2e (${months}mo, kg)` },
      { key: 'emissionBudget', label: 'Emission Budget (kg)' },
    ],
    rows,
    meta: { generatedAt: new Date(), months, period },
  };
};

export const getSocialReport = async ({ department }) => {
  const departments = await deptFilter(department);
  const period = currentPeriod();
  const scores = await DepartmentScore.find({ period }).lean();
  const scoreByDept = new Map(scores.map((s) => [s.department.toString(), s]));

  const rows = await Promise.all(
    departments.map(async (dept) => {
      const deptEmployeeIds = await User.find({ department: dept._id }).distinct('_id');
      const approvedCSR = await EmployeeParticipation.countDocuments({
        employee: { $in: deptEmployeeIds },
        approvalStatus: 'Approved',
      });
      const trainingCompleted = await User.countDocuments({
        department: dept._id,
        trainingCompleted: true,
      });

      return {
        departmentName: dept.name,
        departmentCode: dept.code,
        socialScore: Math.round(scoreByDept.get(dept._id.toString())?.socialScore ?? 0),
        employeeCount: dept.employeeCount,
        approvedCSRCount: approvedCSR,
        trainingCompletionPct: dept.employeeCount
          ? Math.round((trainingCompleted / dept.employeeCount) * 100)
          : 0,
        diversityScore: dept.diversityScore,
      };
    }),
  );

  return {
    title: 'Social Report',
    columns: [
      { key: 'departmentName', label: 'Department' },
      { key: 'departmentCode', label: 'Code' },
      { key: 'socialScore', label: 'Social Score' },
      { key: 'employeeCount', label: 'Employees' },
      { key: 'approvedCSRCount', label: 'Approved CSR' },
      { key: 'trainingCompletionPct', label: 'Training %' },
      { key: 'diversityScore', label: 'Diversity Score' },
    ],
    rows,
    meta: { generatedAt: new Date(), period },
  };
};

export const getGovernanceReport = async ({ department }) => {
  const departments = await deptFilter(department);
  const period = currentPeriod();
  const scores = await DepartmentScore.find({ period }).lean();
  const scoreByDept = new Map(scores.map((s) => [s.department.toString(), s]));

  const requiredPolicyIds = await ESGPolicy.find({
    requiresAcknowledgement: true,
    status: 'active',
  }).distinct('_id');

  const rows = await Promise.all(
    departments.map(async (dept) => {
      const deptEmployeeIds = await User.find({ department: dept._id }).distinct('_id');
      const acknowledged = await PolicyAcknowledgement.countDocuments({
        employee: { $in: deptEmployeeIds },
        policy: { $in: requiredPolicyIds },
      });
      const ackUniverse = requiredPolicyIds.length * dept.employeeCount;

      const auditsCount = await Audit.countDocuments({ department: dept._id });
      const openIssues = await ComplianceIssue.countDocuments({
        department: dept._id,
        status: { $ne: 'Resolved' },
      });

      return {
        departmentName: dept.name,
        departmentCode: dept.code,
        governanceScore: Math.round(scoreByDept.get(dept._id.toString())?.governanceScore ?? 0),
        ackRatePct: ackUniverse ? Math.round((acknowledged / ackUniverse) * 100) : 100,
        auditsCount,
        openComplianceIssues: openIssues,
      };
    }),
  );

  return {
    title: 'Governance Report',
    columns: [
      { key: 'departmentName', label: 'Department' },
      { key: 'departmentCode', label: 'Code' },
      { key: 'governanceScore', label: 'Gov. Score' },
      { key: 'ackRatePct', label: 'Ack. Rate %' },
      { key: 'auditsCount', label: 'Audits' },
      { key: 'openComplianceIssues', label: 'Open Issues' },
    ],
    rows,
    meta: { generatedAt: new Date(), period },
  };
};

export const getESGSummaryReport = async () => {
  const ranking = await getDepartmentRanking();
  const overall = await getOverall();

  const rows = ranking.map((r) => ({
    departmentName: r.department.name,
    departmentCode: r.department.code,
    environmentalScore: Math.round(r.environmentalScore),
    socialScore: Math.round(r.socialScore),
    governanceScore: Math.round(r.governanceScore),
    totalScore: Math.round(r.totalScore),
  }));

  return {
    title: 'ESG Summary Report',
    columns: [
      { key: 'departmentName', label: 'Department' },
      { key: 'departmentCode', label: 'Code' },
      { key: 'environmentalScore', label: 'Environmental' },
      { key: 'socialScore', label: 'Social' },
      { key: 'governanceScore', label: 'Governance' },
      { key: 'totalScore', label: 'Total' },
    ],
    rows,
    meta: { generatedAt: new Date(), overall },
  };
};

const CANNED_REPORTS = {
  environmental: getEnvironmentalReport,
  social: getSocialReport,
  governance: getGovernanceReport,
  'esg-summary': getESGSummaryReport,
};

export const getCannedReport = (type, query) => {
  const fn = CANNED_REPORTS[type];
  if (!fn) throw new AppError(404, `Unknown report type "${type}"`);
  return fn(query);
};

const buildDateMatch = (field, dateRange) => {
  if (!dateRange?.from && !dateRange?.to) return {};
  const match = {};
  if (dateRange.from) match.$gte = new Date(dateRange.from);
  if (dateRange.to) match.$lte = new Date(dateRange.to);
  return { [field]: match };
};

// Custom Report Builder: dispatches to the collection matching `module` and
// composes a $match from whichever filters apply to it.
export const getCustomReport = async (filters) => {
  const { module, department, employee, challenge, esgCategory, severity, dateRange } = filters;

  if (module === 'environmental') {
    const match = {
      ...(department ? { department: new mongoose.Types.ObjectId(department) } : {}),
      ...buildDateMatch('date', dateRange),
    };
    const rows = await CarbonTransaction.find(match)
      .populate('department', 'name')
      .populate('emissionFactor', 'name unit')
      .sort({ date: -1 })
      .limit(500)
      .lean();

    return {
      title: 'Custom Report — Environmental',
      columns: [
        { key: 'date', label: 'Date' },
        { key: 'departmentName', label: 'Department' },
        { key: 'sourceType', label: 'Source Type' },
        { key: 'activityData', label: 'Quantity' },
        { key: 'co2Amount', label: 'CO2e (kg)' },
      ],
      rows: rows.map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        departmentName: r.department?.name,
        sourceType: r.sourceType,
        activityData: r.activityData,
        co2Amount: Math.round(r.co2Amount),
      })),
      meta: { generatedAt: new Date(), count: rows.length },
    };
  }

  if (module === 'social') {
    const match = {
      ...(employee ? { employee: new mongoose.Types.ObjectId(employee) } : {}),
      ...buildDateMatch('createdAt', dateRange),
    };
    const rows = await EmployeeParticipation.find(match)
      .populate('employee', 'name department')
      .populate('activity', 'title')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    const filtered = department
      ? rows.filter((r) => r.employee?.department?.toString() === department)
      : rows;

    return {
      title: 'Custom Report — Social',
      columns: [
        { key: 'employeeName', label: 'Employee' },
        { key: 'activityTitle', label: 'Activity' },
        { key: 'approvalStatus', label: 'Status' },
        { key: 'pointsEarned', label: 'Points' },
      ],
      rows: filtered.map((r) => ({
        employeeName: r.employee?.name,
        activityTitle: r.activity?.title,
        approvalStatus: r.approvalStatus,
        pointsEarned: r.pointsEarned,
      })),
      meta: { generatedAt: new Date(), count: filtered.length },
    };
  }

  if (module === 'governance') {
    if (esgCategory) {
      const match = { category: esgCategory, ...buildDateMatch('effectiveDate', dateRange) };
      const rows = await ESGPolicy.find(match).sort({ effectiveDate: -1 }).limit(500).lean();
      return {
        title: `Custom Report — Governance (${esgCategory})`,
        columns: [
          { key: 'title', label: 'Policy' },
          { key: 'category', label: 'Category' },
          { key: 'effectiveDate', label: 'Effective Date' },
          { key: 'requiresAcknowledgement', label: 'Requires Ack.' },
        ],
        rows: rows.map((r) => ({
          title: r.title,
          category: r.category,
          effectiveDate: r.effectiveDate.toISOString().slice(0, 10),
          requiresAcknowledgement: r.requiresAcknowledgement ? 'Yes' : 'No',
        })),
        meta: { generatedAt: new Date(), count: rows.length },
      };
    }

    const match = {
      ...(department ? { department: new mongoose.Types.ObjectId(department) } : {}),
      ...(severity ? { severity } : {}),
      ...buildDateMatch('dueDate', dateRange),
    };
    const rows = await ComplianceIssue.find(match)
      .populate('owner', 'name')
      .populate('department', 'name')
      .sort({ dueDate: 1 })
      .limit(500)
      .lean();

    return {
      title: 'Custom Report — Governance (Compliance Issues)',
      columns: [
        { key: 'title', label: 'Issue' },
        { key: 'departmentName', label: 'Department' },
        { key: 'severity', label: 'Severity' },
        { key: 'status', label: 'Status' },
        { key: 'ownerName', label: 'Owner' },
        { key: 'dueDate', label: 'Due Date' },
      ],
      rows: rows.map((r) => ({
        title: r.title,
        departmentName: r.department?.name,
        severity: r.severity,
        status: r.status,
        ownerName: r.owner?.name,
        dueDate: r.dueDate.toISOString().slice(0, 10),
      })),
      meta: { generatedAt: new Date(), count: rows.length },
    };
  }

  // gamification
  const match = {
    ...(challenge ? { challenge: new mongoose.Types.ObjectId(challenge) } : {}),
    ...(employee ? { employee: new mongoose.Types.ObjectId(employee) } : {}),
    ...buildDateMatch('createdAt', dateRange),
  };
  const rows = await ChallengeParticipation.find(match)
    .populate('employee', 'name')
    .populate('challenge', 'title xp')
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  return {
    title: 'Custom Report — Gamification',
    columns: [
      { key: 'employeeName', label: 'Employee' },
      { key: 'challengeTitle', label: 'Challenge' },
      { key: 'progress', label: 'Progress %' },
      { key: 'approvalStatus', label: 'Status' },
      { key: 'xpAwarded', label: 'XP Awarded' },
    ],
    rows: rows.map((r) => ({
      employeeName: r.employee?.name,
      challengeTitle: r.challenge?.title,
      progress: r.progress,
      approvalStatus: r.approvalStatus,
      xpAwarded: r.xpAwarded,
    })),
    meta: { generatedAt: new Date(), count: rows.length },
  };
};
