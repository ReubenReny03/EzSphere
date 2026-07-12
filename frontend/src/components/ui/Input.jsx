import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Input = forwardRef(({ label, error, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-text placeholder:text-muted transition-colors',
          'hover:border-muted/50 focus-visible:ring-2 focus-visible:ring-social',
          error && 'border-danger',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
