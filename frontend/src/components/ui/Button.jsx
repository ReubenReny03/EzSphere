import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const VARIANTS = {
  primary: 'bg-text text-bg hover:bg-white',
  env: 'bg-env text-bg hover:brightness-110',
  social: 'bg-social text-bg hover:brightness-110',
  gov: 'bg-gov text-bg hover:brightness-110',
  game: 'bg-game text-bg hover:brightness-110',
  ghost: 'bg-transparent text-text border border-border hover:bg-surface2',
  danger: 'bg-danger text-white hover:brightness-110',
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
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
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
