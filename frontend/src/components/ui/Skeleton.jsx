import { cn } from '@/lib/cn';

export const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-lg bg-surface2', className)} />
);
