import { Department } from '../../models/Department.js';
import { DepartmentScore } from '../../models/DepartmentScore.js';
import { getOverall, computeAllAndCache, currentPeriod } from '../../services/scoreEngine.js';

export const getOverview = () => getOverall();

export const getDepartmentRanking = async () => {
  const period = currentPeriod();
  const depts = await Department.find({ status: 'active' }).sort({ name: 1 }).lean();
  const scores = await DepartmentScore.find({ period }).lean();
  const scoreByDept = new Map(scores.map((s) => [s.department.toString(), s]));

  return depts
    .map((dept) => ({
      department: { _id: dept._id, name: dept.name, code: dept.code },
      environmentalScore: scoreByDept.get(dept._id.toString())?.environmentalScore ?? 0,
      socialScore: scoreByDept.get(dept._id.toString())?.socialScore ?? 0,
      governanceScore: scoreByDept.get(dept._id.toString())?.governanceScore ?? 0,
      totalScore: scoreByDept.get(dept._id.toString())?.totalScore ?? 0,
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
};

export const recomputeAll = async () => {
  const results = await computeAllAndCache();
  return results.length;
};
