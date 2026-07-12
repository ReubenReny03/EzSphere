import { Department } from '../models/Department.js';
import { EnvironmentalGoal } from '../models/EnvironmentalGoal.js';
import { CarbonTransaction } from '../models/CarbonTransaction.js';
import { User } from '../models/User.js';
import { EmployeeParticipation } from '../models/EmployeeParticipation.js';
import { ESGPolicy } from '../models/ESGPolicy.js';
import { PolicyAcknowledgement } from '../models/PolicyAcknowledgement.js';
import { Audit } from '../models/Audit.js';
import { ComplianceIssue } from '../models/ComplianceIssue.js';
import { DepartmentScore } from '../models/DepartmentScore.js';
import { Setting } from '../models/Setting.js';
import { getIO } from '../config/socket.js';
import { SOCKET_EVENTS } from '../sockets/events.js';
import { TARGET_CSR_PER_HEAD, SEVERITY_WEIGHTS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

const AUDIT_FINDING_PENALTY = 5; // points deducted per average finding, no per-finding severity modeled

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const currentPeriod = (date = new Date()) => {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
};

const computeEnvironmental = async (department) => {
  const goals = await EnvironmentalGoal.find({
    department: department._id,
    status: { $in: ['Active', 'On Track'] },
  }).lean();

  const goalScore =
    goals.length === 0
      ? 100
      : clamp(
          goals.reduce((sum, g) => sum + (g.targetValue ? Math.min(100, (g.currentValue / g.targetValue) * 100) : 0), 0) /
            goals.length,
        );

  const [{ totalCO2 = 0 } = {}] = await CarbonTransaction.aggregate([
    { $match: { department: department._id } },
    { $group: { _id: null, totalCO2: { $sum: '$co2Amount' } } },
  ]);

  const budget = department.emissionBudget || 1;
  const emissionScore = clamp(100 - Math.max(0, (totalCO2 / budget - 1) * 100));

  return { goalScore, emissionScore, score: clamp(0.6 * goalScore + 0.4 * emissionScore) };
};

const computeSocial = async (department) => {
  const employeeCount = department.employeeCount || 0;

  const approvedCSR = await EmployeeParticipation.countDocuments({
    approvalStatus: 'Approved',
    employee: { $in: await User.find({ department: department._id }).distinct('_id') },
  });

  const participationScore =
    employeeCount === 0
      ? 0
      : clamp((approvedCSR / (employeeCount * TARGET_CSR_PER_HEAD)) * 100);

  const trainingCompletedUsers = await User.countDocuments({
    department: department._id,
    trainingCompleted: true,
  });

  const trainingScore = employeeCount === 0 ? 0 : clamp((trainingCompletedUsers / employeeCount) * 100);

  const diversityScore = clamp(department.diversityScore ?? 70);

  return {
    participationScore,
    trainingScore,
    diversityScore,
    score: clamp(0.5 * participationScore + 0.3 * trainingScore + 0.2 * diversityScore),
  };
};

const computeGovernance = async (department) => {
  const employeeCount = department.employeeCount || 0;
  const requiredPolicies = await ESGPolicy.countDocuments({
    requiresAcknowledgement: true,
    status: 'active',
  });

  const deptEmployeeIds = await User.find({ department: department._id }).distinct('_id');
  const requiredPolicyIds = await ESGPolicy.find({
    requiresAcknowledgement: true,
    status: 'active',
  }).distinct('_id');

  const acknowledgedRequiredPolicies = await PolicyAcknowledgement.countDocuments({
    employee: { $in: deptEmployeeIds },
    policy: { $in: requiredPolicyIds },
  });

  const ackUniverse = requiredPolicies * employeeCount;
  const ackRate = ackUniverse === 0 ? 100 : clamp((acknowledgedRequiredPolicies / ackUniverse) * 100);

  const [{ avgFindings = 0 } = {}] = await Audit.aggregate([
    { $match: { department: department._id } },
    { $group: { _id: null, avgFindings: { $avg: '$findingsCount' } } },
  ]);
  const auditScore = clamp(100 - avgFindings * AUDIT_FINDING_PENALTY);

  const openIssues = await ComplianceIssue.find({
    department: department._id,
    status: { $ne: 'Resolved' },
  }).lean();
  const severityPenalty = openIssues.reduce((sum, issue) => sum + (SEVERITY_WEIGHTS[issue.severity] || 0), 0);
  const complianceScore = clamp(100 - severityPenalty);

  return {
    ackRate,
    auditScore,
    complianceScore,
    score: clamp(0.4 * ackRate + 0.3 * auditScore + 0.3 * complianceScore),
  };
};

export const computeDepartmentScore = async (deptId) => {
  const department = await Department.findById(deptId);
  if (!department) return null;

  const environmental = await computeEnvironmental(department);
  const social = await computeSocial(department);
  const governance = await computeGovernance(department);

  const settings = await Setting.getGlobal();
  const { environmental: wE, social: wS, governance: wG } = settings.esgWeights;

  const totalScore = clamp(wE * environmental.score + wS * social.score + wG * governance.score);

  const period = currentPeriod();
  const snapshot = await DepartmentScore.findOneAndUpdate(
    { department: deptId, period },
    {
      department: deptId,
      period,
      environmentalScore: environmental.score,
      socialScore: social.score,
      governanceScore: governance.score,
      totalScore,
      computedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  try {
    getIO().emit(SOCKET_EVENTS.SCORE_UPDATED, { period, departmentId: deptId.toString() });
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping SCORE_UPDATED emit');
  }

  return { snapshot, environmental, social, governance };
};

export const computeAllAndCache = async (period = currentPeriod()) => {
  const departments = await Department.find({ status: 'active' });
  const results = await Promise.all(departments.map((d) => computeDepartmentScore(d._id)));
  return results.filter(Boolean);
};

export const getOverall = async () => {
  const period = currentPeriod();
  const departments = await Department.find({ status: 'active' }).lean();
  const scores = await DepartmentScore.find({ period }).lean();

  const scoreByDept = new Map(scores.map((s) => [s.department.toString(), s]));

  let weightedSum = 0;
  let totalEmployees = 0;
  let envSum = 0;
  let socialSum = 0;
  let govSum = 0;

  departments.forEach((dept) => {
    const s = scoreByDept.get(dept._id.toString());
    if (!s) return;
    const weight = dept.employeeCount || 0;
    weightedSum += s.totalScore * weight;
    envSum += s.environmentalScore * weight;
    socialSum += s.socialScore * weight;
    govSum += s.governanceScore * weight;
    totalEmployees += weight;
  });

  if (totalEmployees === 0) {
    return { environmental: 0, social: 0, governance: 0, overall: 0, period };
  }

  return {
    environmental: clamp(envSum / totalEmployees),
    social: clamp(socialSum / totalEmployees),
    governance: clamp(govSum / totalEmployees),
    overall: clamp(weightedSum / totalEmployees),
    period,
  };
};
