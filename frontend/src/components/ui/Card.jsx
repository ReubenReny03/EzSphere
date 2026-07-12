import { cn } from '@/lib/cn';

export const Card = ({ title, icon: Icon, action, className, children }) => (
  <div className={cn('rounded-xl border border-border bg-surface p-5', className)}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between">
        {title && (
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
            {Icon && <Icon className="h-4 w-4 text-muted" />}
            {title}
          </h3>
        )}
        {action}
      </div>
    )}
    {children}
  </div>
);
