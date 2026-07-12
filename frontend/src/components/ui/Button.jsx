import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const VARIANTS = {
  primary: 'bg-text text-bg hover:bg-white shadow-soft',
  env: 'bg-env text-bg hover:brightness-110 shadow-soft shadow-env/20',
  social: 'bg-social text-bg hover:brightness-110 shadow-soft shadow-social/20',
  gov: 'bg-gov text-bg hover:brightness-110 shadow-soft shadow-gov/20',
  game: 'bg-game text-bg hover:brightness-110 shadow-soft shadow-game/20',
  ghost: 'bg-transparent text-text border border-border hover:border-muted/50 hover:bg-surface2',
  danger: 'bg-danger text-white hover:brightness-110 shadow-soft shadow-danger/20',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
};

export const Button = forwardRef(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
