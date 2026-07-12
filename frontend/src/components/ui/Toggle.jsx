import { cn } from '@/lib/cn';

export const Toggle = ({ checked, onChange, label, description, disabled }) => (
  <label className={cn('flex items-center justify-between gap-4 py-2', disabled && 'opacity-50')}>
    <span>
      {label && <span className="block text-sm font-medium text-text">{label}</span>}
      {description && <span className="block text-xs text-muted">{description}</span>}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed',
        checked ? 'bg-env' : 'bg-surface2',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  </label>
);
