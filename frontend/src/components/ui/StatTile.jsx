import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/cn';

const ACCENT_BORDERS = {
  env: 'border-l-env',
  social: 'border-l-social',
  gov: 'border-l-gov',
  game: 'border-l-game',
  text: 'border-l-text',
};

export const StatTile = ({ label, value, max = 100, accent = 'text', trend }) => (
  <div className={cn('rounded-xl border border-border border-l-4 bg-surface p-5', ACCENT_BORDERS[accent])}>
    <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
    <div className="mt-2 flex items-baseline gap-1">
      <span className="text-3xl font-semibold text-text">{Math.round(value)}</span>
      <span className="text-sm text-muted">/ {max}</span>
    </div>
    {trend != null && (
      <div
        className={cn(
          'mt-2 flex items-center gap-1 text-xs font-medium',
          trend >= 0 ? 'text-success' : 'text-danger',
        )}
      >
        {trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {Math.abs(trend)}% vs last period
      </div>
    )}
  </div>
);
