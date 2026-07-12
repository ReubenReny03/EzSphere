import { cn } from '@/lib/cn';

const COLOR_CLASSES = {
  success: 'bg-success/10 text-success border-success/30',
  info: 'bg-info/10 text-info border-info/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  review: 'bg-review/10 text-review border-review/30',
  muted: 'bg-muted/10 text-muted border-muted/30',
};

// §5 status → colour map. `context` disambiguates "Completed", which means
// success for departments/challenges/CSR but info for goals/audits.
const STATUS_MAP = {
  Active: 'success',
  'On Track': 'success',
  Approved: 'success',
  Resolved: 'success',
  Fulfilled: 'success',
  Pending: 'warning',
  Draft: 'warning',
  Medium: 'warning',
  'Under Review': 'review',
  High: 'danger',
  Critical: 'danger',
  Open: 'danger',
  Rejected: 'danger',
  Cancelled: 'danger',
  Low: 'muted',
  Archived: 'muted',
  inactive: 'muted',
  active: 'success',
};

const colorFor = (status, context) => {
  if (status === 'Completed') return context === 'goal' || context === 'audit' ? 'info' : 'success';
  return STATUS_MAP[status] || 'muted';
};

export const Badge = ({ status, context, className }) => {
  const color = colorFor(status, context);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
        COLOR_CLASSES[color],
        className,
      )}
    >
      {status}
    </span>
  );
};
