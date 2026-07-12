import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Textarea = forwardRef(({ label, error, className, id, rows = 3, ...props }, ref) => {
  const areaId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className={cn(
          'rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-text placeholder:text-muted',
          'focus-visible:ring-2 focus-visible:ring-social',
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

Textarea.displayName = 'Textarea';
