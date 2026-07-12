import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCSRActivities } from '@/api/hooks/useCSR';
import { CSRActivityCard } from './CSRActivityCard';

export const ActivitiesTab = () => {
  const { data, isLoading } = useCSRActivities({ status: 'Open', limit: 50 });
  const activities = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) return <EmptyState message="No open CSR activities right now" />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <CSRActivityCard key={activity._id} activity={activity} />
      ))}
    </div>
  );
};
