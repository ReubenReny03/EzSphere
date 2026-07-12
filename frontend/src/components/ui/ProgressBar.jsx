import { cn } from '@/lib/cn';

const ACCENT_CLASSES = {
  env: 'bg-env',
  social: 'bg-social',
  gov: 'bg-gov',
  game: 'bg-game',
};

export const ProgressBar = ({ value = 0, accent = 'env', showLabel = true, className }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface2">
        <div
          className={cn('h-full rounded-full transition-all', ACCENT_CLASSES[accent])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="w-10 shrink-0 text-right text-xs text-muted tabular-nums">{clamped}%</span>}
    </div>
  );
};
