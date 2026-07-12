export const ROLES = { ADMIN: 'admin', MANAGER: 'manager', EMPLOYEE: 'employee' };

export const ACTIVITY_TYPES = ['PURCHASE', 'MANUFACTURING', 'EXPENSE', 'FLEET'];

export const GOAL_METRICS = ['CO2_REDUCTION', 'ENERGY', 'WASTE'];
export const GOAL_STATUSES = ['Active', 'On Track', 'At Risk', 'Completed'];

export const POLICY_CATEGORIES = ['Environmental', 'Social', 'Governance', 'Ethics'];

export const BADGE_METRICS = ['xp', 'challengesCompleted', 'csrCount'];

export const CSR_STATUSES = ['Open', 'Closed'];
export const APPROVAL_STATUSES = ['Pending', 'Approved', 'Rejected'];

export const CHALLENGE_STATUSES = ['Draft', 'Active', 'Under Review', 'Completed', 'Archived'];
export const CHALLENGE_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const AUDIT_STATUSES = ['Scheduled', 'In Progress', 'Under Review', 'Completed'];

export const COMPLIANCE_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
export const COMPLIANCE_STATUSES = ['Open', 'Under Review', 'Resolved'];

export const REDEMPTION_STATUSES = ['Pending', 'Fulfilled', 'Cancelled'];

export const NOTIFICATION_TYPES = [
  'COMPLIANCE_ISSUE',
  'APPROVAL_DECISION',
  'POLICY_REMINDER',
  'BADGE_UNLOCK',
  'REWARD_REDEEMED',
];

export const CATEGORY_TYPES = ['CSR_ACTIVITY', 'CHALLENGE'];

export const STATUS_ACTIVE_INACTIVE = ['active', 'inactive'];

export const CSR_POINTS_PER_ACTIVITY = 50;

// Scoring engine constants
export const TARGET_CSR_PER_HEAD = 2;
export const SEVERITY_WEIGHTS = { Low: 1, Medium: 3, High: 6, Critical: 10 };
export const DEFAULT_ESG_WEIGHTS = { environmental: 0.4, social: 0.3, governance: 0.3 };
export const DEFAULT_EMISSION_BUDGET = 10000; // kgCO2 per department per period, seed-tunable
