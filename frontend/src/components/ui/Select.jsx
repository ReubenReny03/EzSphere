import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Select = forwardRef(({ label, error, options = [], placeholder, className, id, ...props }, ref) => {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-text transition-colors',
          'hover:border-muted/50 focus-visible:ring-2 focus-visible:ring-social',
          error && 'border-danger',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
