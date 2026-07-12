import { cn } from '@/lib/cn';

export const Skeleton = ({ className }) => (
  <div className={cn('relative overflow-hidden rounded-lg bg-surface2', className)}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </div>
);
