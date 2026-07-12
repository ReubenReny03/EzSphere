// Central import so every schema is registered with Mongoose before any
// module/service resolves a ref by string name (e.g. `ref: 'Department'`).
export * from './User.js';
export * from './Department.js';
export * from './Category.js';
export * from './EmissionFactor.js';
export * from './ProductESGProfile.js';
export * from './EnvironmentalGoal.js';
export * from './ESGPolicy.js';
export * from './Badge.js';
export * from './Reward.js';
export * from './CarbonTransaction.js';
export * from './CSRActivity.js';
export * from './EmployeeParticipation.js';
export * from './Challenge.js';
export * from './ChallengeParticipation.js';
export * from './PolicyAcknowledgement.js';
export * from './Audit.js';
export * from './ComplianceIssue.js';
export * from './DepartmentScore.js';
export * from './RewardRedemption.js';
export * from './Notification.js';
export * from './Setting.js';
