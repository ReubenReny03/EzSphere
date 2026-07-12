import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/cn';

const ACCENT_BORDERS = {
  env: 'border-l-env',
  social: 'border-l-social',
  gov: 'border-l-gov',
  game: 'border-l-game',
  text: 'border-l-text',
};

const ACCENT_GLOW = {
  env: 'before:bg-env',
  social: 'before:bg-social',
  gov: 'before:bg-gov',
  game: 'before:bg-game',
  text: 'before:bg-white',
};

export const StatTile = ({ label, value, max = 100, accent = 'text', trend }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-xl border border-border border-l-4 bg-surface p-5 shadow-soft',
      'before:absolute before:-right-8 before:-top-8 before:h-28 before:w-28 before:rounded-full before:opacity-[0.08] before:blur-2xl before:content-[""]',
      ACCENT_BORDERS[accent],
      ACCENT_GLOW[accent],
    )}
  >
    <p className="relative text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    <div className="relative mt-2 flex items-baseline gap-1">
      <span className="text-3xl font-bold tabular-nums text-text">{Math.round(value)}</span>
      <span className="text-sm text-muted">/ {max}</span>
    </div>
    {trend != null && (
      <div
        className={cn(
          'relative mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
          trend >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
        )}
      >
        {trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {Math.abs(trend)}% vs last period
      </div>
    )}
  </div>
);
