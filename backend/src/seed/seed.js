import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { logger } from '../utils/logger.js';
import '../models/index.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Category } from '../models/Category.js';
import { EmissionFactor } from '../models/EmissionFactor.js';
import { ProductESGProfile } from '../models/ProductESGProfile.js';
import { EnvironmentalGoal } from '../models/EnvironmentalGoal.js';
import { ESGPolicy } from '../models/ESGPolicy.js';
import { Badge } from '../models/Badge.js';
import { Reward } from '../models/Reward.js';
import { CarbonTransaction } from '../models/CarbonTransaction.js';
import { CSRActivity } from '../models/CSRActivity.js';
import { EmployeeParticipation } from '../models/EmployeeParticipation.js';
import { Challenge } from '../models/Challenge.js';
import { ChallengeParticipation } from '../models/ChallengeParticipation.js';
import { PolicyAcknowledgement } from '../models/PolicyAcknowledgement.js';
import { Audit } from '../models/Audit.js';
import { ComplianceIssue } from '../models/ComplianceIssue.js';
import { DepartmentScore } from '../models/DepartmentScore.js';
import { RewardRedemption } from '../models/RewardRedemption.js';
import { Notification } from '../models/Notification.js';
import { Setting } from '../models/Setting.js';
import { computeAllAndCache } from '../services/scoreEngine.js';

const DEMO_PASSWORD = 'Password123!';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const monthsAgo = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
};
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const wipe = async () => {
  await Promise.all([
    Notification.deleteMany({}),
    RewardRedemption.deleteMany({}),
    DepartmentScore.deleteMany({}),
    ComplianceIssue.deleteMany({}),
    Audit.deleteMany({}),
    PolicyAcknowledgement.deleteMany({}),
    ChallengeParticipation.deleteMany({}),
    Challenge.deleteMany({}),
    EmployeeParticipation.deleteMany({}),
    CSRActivity.deleteMany({}),
    CarbonTransaction.deleteMany({}),
    Reward.deleteMany({}),
    Badge.deleteMany({}),
    ESGPolicy.deleteMany({}),
    EnvironmentalGoal.deleteMany({}),
    ProductESGProfile.deleteMany({}),
    EmissionFactor.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({}),
    Department.deleteMany({}),
    Setting.deleteMany({}),
  ]);
};

const seed = async () => {
  await connectDB();
  logger.info('Wiping existing data...');
  await wipe();

  logger.info('Seeding departments...');
  const departments = await Department.insertMany([
    { name: 'Engineering', code: 'ENG', diversityScore: 74, emissionBudget: 12000 },
    { name: 'Sales', code: 'SALES', diversityScore: 68, emissionBudget: 8000 },
    { name: 'Operations', code: 'OPS', diversityScore: 71, emissionBudget: 15000 },
    { name: 'Human Resources', code: 'HR', diversityScore: 82, emissionBudget: 3000 },
    { name: 'Finance', code: 'FIN', diversityScore: 65, emissionBudget: 4000 },
  ]);
  const [eng, sales, ops, hr, fin] = departments;

  logger.info('Seeding categories...');
  const categories = await Category.insertMany([
    { name: 'Environment', type: 'CSR_ACTIVITY' },
    { name: 'Community', type: 'CSR_ACTIVITY' },
    { name: 'Education', type: 'CSR_ACTIVITY' },
    { name: 'Sustainability', type: 'CHALLENGE' },
    { name: 'Wellness', type: 'CHALLENGE' },
    { name: 'Learning', type: 'CHALLENGE' },
  ]);
  const [catEnv, catCommunity, catEducation, catSustainability, catWellness, catLearning] = categories;

  logger.info('Seeding users...');
  const userSpecs = [
    { name: 'Ava Admin', email: 'admin@ecosphere.dev', role: 'admin', department: eng._id, title: 'Platform Admin' },
    { name: 'Miguel Santos', email: 'miguel.manager@ecosphere.dev', role: 'manager', department: eng._id, title: 'Engineering Manager' },
    { name: 'Priya Nair', email: 'priya.manager@ecosphere.dev', role: 'manager', department: sales._id, title: 'Sales Manager' },
    { name: 'Tomás Alvarez', email: 'tomas.manager@ecosphere.dev', role: 'manager', department: ops._id, title: 'Operations Manager' },
    { name: 'Grace Chen', email: 'grace.chen@ecosphere.dev', department: eng._id, title: 'Software Engineer' },
    { name: 'Liam O’Connor', email: 'liam.oconnor@ecosphere.dev', department: eng._id, title: 'Software Engineer' },
    { name: 'Fatima Khan', email: 'fatima.khan@ecosphere.dev', department: eng._id, title: 'QA Engineer' },
    { name: 'Noah Kim', email: 'noah.kim@ecosphere.dev', department: sales._id, title: 'Account Executive' },
    { name: 'Sofia Rossi', email: 'sofia.rossi@ecosphere.dev', department: sales._id, title: 'Sales Rep' },
    { name: 'Ethan Brooks', email: 'ethan.brooks@ecosphere.dev', department: ops._id, title: 'Ops Analyst' },
    { name: 'Aisha Bello', email: 'aisha.bello@ecosphere.dev', department: ops._id, title: 'Logistics Coordinator' },
    { name: 'Daniel Novak', email: 'daniel.novak@ecosphere.dev', department: ops._id, title: 'Fleet Supervisor' },
    { name: 'Hana Suzuki', email: 'hana.suzuki@ecosphere.dev', department: hr._id, title: 'HR Business Partner' },
    { name: 'Carlos Mendes', email: 'carlos.mendes@ecosphere.dev', department: hr._id, title: 'Recruiter' },
    { name: 'Elena Petrova', email: 'elena.petrova@ecosphere.dev', department: fin._id, title: 'Financial Analyst' },
    { name: 'Ravi Deshpande', email: 'ravi.deshpande@ecosphere.dev', department: fin._id, title: 'Accountant' },
  ];

  const users = [];
  for (const spec of userSpecs) {
    // eslint-disable-next-line no-await-in-loop
    const user = await User.create({
      ...spec,
      passwordHash: DEMO_PASSWORD,
      trainingCompleted: Math.random() > 0.35,
    });
    users.push(user);
  }

  await Promise.all(departments.map((d) => Department.recomputeEmployeeCount(d._id)));
  const employees = users.filter((u) => u.role === 'employee');

  logger.info('Seeding emission factors...');
  const emissionFactors = await EmissionFactor.insertMany([
    { name: 'Grid Electricity', activityType: 'PURCHASE', unit: 'kgCO2/kWh', value: 0.42, source: 'National grid average' },
    { name: 'Steel Manufacturing', activityType: 'MANUFACTURING', unit: 'kgCO2/kg', value: 1.85, source: 'Industry benchmark' },
    { name: 'Business Travel Expense', activityType: 'EXPENSE', unit: 'kgCO2/USD', value: 0.09, source: 'Spend-based factor' },
    { name: 'Diesel Fleet', activityType: 'FLEET', unit: 'kgCO2/L', value: 2.68, source: 'EPA fleet factor' },
  ]);

  logger.info('Seeding product ESG profiles...');
  await ProductESGProfile.insertMany([
    { name: 'EcoSphere Widget A', sku: 'ESW-A100', department: eng._id, carbonFootprint: 12.4, recyclablePct: 78, ethicalSourcingScore: 82 },
    { name: 'EcoSphere Widget B', sku: 'ESW-B200', department: ops._id, carbonFootprint: 27.1, recyclablePct: 55, ethicalSourcingScore: 64 },
    { name: 'EcoSphere Service Pack', sku: 'ESP-S300', department: sales._id, carbonFootprint: 3.2, recyclablePct: 90, ethicalSourcingScore: 91 },
  ]);

  logger.info('Seeding environmental goals...');
  await EnvironmentalGoal.insertMany([
    { name: 'Reduce Engineering CO2 by 15%', department: eng._id, metric: 'CO2_REDUCTION', targetValue: 100, currentValue: 82, unit: '%', deadline: daysFromNow(90), status: 'On Track' },
    { name: 'Cut Sales Travel Emissions', department: sales._id, metric: 'CO2_REDUCTION', targetValue: 100, currentValue: 46, unit: '%', deadline: daysFromNow(60), status: 'At Risk' },
    { name: 'Fleet Energy Efficiency', department: ops._id, metric: 'ENERGY', targetValue: 100, currentValue: 91, unit: '%', deadline: daysFromNow(120), status: 'On Track' },
    { name: 'Office Waste Reduction', department: hr._id, metric: 'WASTE', targetValue: 100, currentValue: 100, unit: '%', deadline: daysAgo(5), status: 'Completed' },
    { name: 'Finance Paperless Initiative', department: fin._id, metric: 'WASTE', targetValue: 100, currentValue: 58, unit: '%', deadline: daysFromNow(45), status: 'Active' },
    { name: 'Warehouse Energy Retrofit', department: ops._id, metric: 'ENERGY', targetValue: 100, currentValue: 30, unit: '%', deadline: daysFromNow(200), status: 'At Risk' },
  ]);

  logger.info('Seeding ESG policies...');
  const policies = await ESGPolicy.insertMany([
    { title: 'Environmental Sustainability Policy', category: 'Environmental', description: 'Guidelines for reducing environmental impact.', effectiveDate: monthsAgo(6), requiresAcknowledgement: true },
    { title: 'Code of Conduct', category: 'Ethics', description: 'Expected employee conduct standards.', effectiveDate: monthsAgo(12), requiresAcknowledgement: true },
    { title: 'Diversity & Inclusion Policy', category: 'Social', description: 'Commitments to a diverse, inclusive workplace.', effectiveDate: monthsAgo(4), requiresAcknowledgement: true },
    { title: 'Anti-Corruption Governance Policy', category: 'Governance', description: 'Governance controls against corruption.', effectiveDate: monthsAgo(8), requiresAcknowledgement: false },
  ]);

  logger.info('Seeding policy acknowledgements...');
  const requiredPolicies = policies.filter((p) => p.requiresAcknowledgement);
  const ackDocs = [];
  users.forEach((user) => {
    requiredPolicies.forEach((policy) => {
      if (Math.random() > 0.3) {
        ackDocs.push({ policy: policy._id, employee: user._id, acknowledgedAt: daysAgo(randInt(1, 90)) });
      }
    });
  });
  await PolicyAcknowledgement.insertMany(ackDocs);

  logger.info('Seeding badges...');
  const badges = await Badge.insertMany([
    { name: 'Green Starter', description: 'Completed your first CSR activity.', icon: '🌱', unlockRule: { metric: 'csrCount', threshold: 1 } },
    { name: 'Eco Champion', description: 'Completed 5 CSR activities.', icon: '🏆', unlockRule: { metric: 'csrCount', threshold: 5 } },
    { name: 'Challenge Rookie', description: 'Completed your first challenge.', icon: '🎯', unlockRule: { metric: 'challengesCompleted', threshold: 1 } },
    { name: 'XP Master', description: 'Earned 500 XP.', icon: '⭐', unlockRule: { metric: 'xp', threshold: 500 } },
  ]);

  logger.info('Seeding rewards...');
  await Reward.insertMany([
    { name: '$10 Coffee Voucher', description: 'Redeemable at the office café.', pointsRequired: 100, stock: 50 },
    { name: 'Extra PTO Day', description: 'One additional paid day off.', pointsRequired: 500, stock: 10 },
    { name: 'EcoSphere Branded Water Bottle', description: 'Reusable stainless steel bottle.', pointsRequired: 150, stock: 30 },
    { name: 'Charity Donation Match', description: 'Company matches a $25 donation in your name.', pointsRequired: 200, stock: 20 },
  ]);

  logger.info('Seeding carbon transactions (~80 across 12 months)...');
  const carbonDocs = [];
  for (let i = 0; i < 80; i += 1) {
    const monthOffset = randInt(0, 11);
    const dept = pick(departments);
    const factor = pick(emissionFactors);
    carbonDocs.push({
      department: dept._id,
      sourceType: factor.activityType,
      sourceRef: `SRC-${1000 + i}`,
      activityData: randInt(50, 800),
      emissionFactor: factor._id,
      co2Amount: 0, // recomputed below per-document to run the model hook
      date: monthsAgo(monthOffset),
      createdBy: pick(users)._id,
    });
  }
  // insertMany bypasses the pre-validate hook's need for `this` document context
  // safely here since we compute co2Amount inline instead.
  const factorById = new Map(emissionFactors.map((f) => [f._id.toString(), f.value]));
  carbonDocs.forEach((doc) => {
    doc.co2Amount = doc.activityData * factorById.get(doc.emissionFactor.toString());
  });
  await CarbonTransaction.insertMany(carbonDocs);

  logger.info('Seeding CSR activities & participation...');
  const csrActivities = await CSRActivity.insertMany([
    { title: 'Community Beach Cleanup', category: catEnv._id, description: 'Cleanup drive at the coast.', evidenceRequired: true, date: daysAgo(20), capacity: 30 },
    { title: 'Local Food Bank Volunteering', category: catCommunity._id, description: 'Sorting and distributing food.', evidenceRequired: false, date: daysAgo(10), capacity: 20 },
    { title: 'STEM Mentoring for Students', category: catEducation._id, description: 'Mentor local high school students.', evidenceRequired: true, date: daysFromNow(15), capacity: 15 },
    { title: 'Tree Planting Drive', category: catEnv._id, description: 'Planting trees in the city park.', evidenceRequired: true, date: daysFromNow(5), capacity: 40 },
  ]);

  const participationDocs = [];
  employees.forEach((employee) => {
    csrActivities.forEach((activity) => {
      if (Math.random() > 0.5) {
        const roll = Math.random();
        const approvalStatus = roll > 0.66 ? 'Approved' : roll > 0.33 ? 'Pending' : 'Rejected';
        participationDocs.push({
          employee: employee._id,
          activity: activity._id,
          proof: activity.evidenceRequired && approvalStatus !== 'Pending' ? `uploads/seed-proof-${employee._id}.jpg` : undefined,
          approvalStatus,
          pointsEarned: approvalStatus === 'Approved' ? 50 : 0,
          completionDate: approvalStatus === 'Approved' ? daysAgo(randInt(1, 15)) : undefined,
        });
      }
    });
  });
  await EmployeeParticipation.insertMany(participationDocs);

  await Promise.all(csrActivities.map((a) => CSRActivity.recomputeJoinedCount(a._id)));

  // Reflect approved CSR participation back onto user counters (mirrors what
  // the approval endpoint does at request-time) so seeded data is consistent.
  const approvedByEmployee = new Map();
  participationDocs
    .filter((p) => p.approvalStatus === 'Approved')
    .forEach((p) => {
      const key = p.employee.toString();
      approvedByEmployee.set(key, (approvedByEmployee.get(key) || 0) + 1);
    });
  await Promise.all(
    Array.from(approvedByEmployee.entries()).map(([userId, count]) =>
      User.findByIdAndUpdate(userId, { $inc: { pointsBalance: count * 50, csrCount: count } }),
    ),
  );

  logger.info('Seeding challenges & participation...');
  const challenges = await Challenge.insertMany([
    { title: 'Cycle to Work Week', category: catSustainability._id, description: 'Log 5 days of cycling to work.', xp: 200, difficulty: 'Easy', evidenceRequired: false, deadline: daysFromNow(30), status: 'Active' },
    { title: 'Zero-Waste Lunch Challenge', category: catSustainability._id, description: 'Bring a zero-waste lunch for a week.', xp: 150, difficulty: 'Easy', evidenceRequired: true, deadline: daysFromNow(20), status: 'Active' },
    { title: 'Wellness Step Count', category: catWellness._id, description: 'Hit 70,000 steps in a week.', xp: 100, difficulty: 'Medium', evidenceRequired: false, deadline: daysAgo(5), status: 'Under Review' },
    { title: 'ESG Certification Course', category: catLearning._id, description: 'Complete an ESG fundamentals course.', xp: 300, difficulty: 'Hard', evidenceRequired: true, deadline: daysAgo(30), status: 'Completed' },
    { title: 'Draft: Carbon Literacy Workshop', category: catLearning._id, description: 'Planned internal workshop.', xp: 120, difficulty: 'Medium', evidenceRequired: false, deadline: daysFromNow(60), status: 'Draft' },
  ]);

  const challengeParticipationDocs = [];
  employees.forEach((employee) => {
    challenges
      .filter((c) => c.status !== 'Draft')
      .forEach((challenge) => {
        if (Math.random() > 0.55) {
          const roll = Math.random();
          const approvalStatus = roll > 0.6 ? 'Approved' : roll > 0.3 ? 'Pending' : 'Rejected';
          challengeParticipationDocs.push({
            challenge: challenge._id,
            employee: employee._id,
            progress: approvalStatus === 'Approved' ? 100 : randInt(10, 90),
            proof: challenge.evidenceRequired && approvalStatus === 'Approved' ? `uploads/seed-proof-${employee._id}.jpg` : undefined,
            approvalStatus,
            xpAwarded: approvalStatus === 'Approved' ? challenge.xp : 0,
          });
        }
      });
  });
  await ChallengeParticipation.insertMany(challengeParticipationDocs);

  const xpByEmployee = new Map();
  const completedByEmployee = new Map();
  challengeParticipationDocs
    .filter((p) => p.approvalStatus === 'Approved')
    .forEach((p) => {
      const key = p.employee.toString();
      xpByEmployee.set(key, (xpByEmployee.get(key) || 0) + p.xpAwarded);
      completedByEmployee.set(key, (completedByEmployee.get(key) || 0) + 1);
    });
  await Promise.all(
    Array.from(xpByEmployee.keys()).map((userId) =>
      User.findByIdAndUpdate(userId, {
        $inc: { xp: xpByEmployee.get(userId), challengesCompleted: completedByEmployee.get(userId) || 0 },
      }),
    ),
  );

  logger.info('Seeding audits...');
  const audits = await Audit.insertMany([
    { title: 'Q1 Environmental Compliance Audit', department: ops._id, auditor: 'Green Line Auditors', date: daysAgo(45), findingsCount: 3, findings: 'Minor waste segregation gaps.', status: 'Completed' },
    { title: 'Governance Policy Review', department: fin._id, auditor: 'Internal Audit Team', date: daysAgo(10), findingsCount: 1, findings: 'Approval workflow documentation outdated.', status: 'Under Review' },
  ]);

  logger.info('Seeding compliance issues (incl. one overdue)...');
  const manager = users.find((u) => u.role === 'manager');
  await ComplianceIssue.insertMany([
    {
      audit: audits[0]._id,
      title: 'Waste segregation non-compliance at Ops warehouse',
      description: 'Recyclables improperly mixed with general waste.',
      severity: 'High',
      owner: manager._id,
      dueDate: daysAgo(3), // overdue on purpose, for the golden demo path
      department: ops._id,
      status: 'Open',
    },
    {
      title: 'Outdated approval workflow documentation',
      description: 'Governance docs reference a deprecated approval chain.',
      severity: 'Medium',
      owner: users.find((u) => u.department?.toString() === fin._id.toString() && u.role !== 'admin')._id,
      dueDate: daysFromNow(14),
      department: fin._id,
      status: 'Open',
    },
  ]);

  logger.info('Seeding global settings...');
  await Setting.create({ key: 'global' });

  logger.info('Computing initial department & overall ESG scores...');
  await computeAllAndCache();

  logger.info('Seed complete.');
  logger.info(`Demo login — email: admin@ecosphere.dev / manager: miguel.manager@ecosphere.dev / employee: grace.chen@ecosphere.dev — password: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  logger.error({ err }, 'Seeding failed');
  process.exit(1);
});
