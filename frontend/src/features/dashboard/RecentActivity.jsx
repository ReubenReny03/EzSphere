import { Bell } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotifications } from '@/api/hooks/useNotifications';
import { timeAgo } from '@/lib/format';

export const RecentActivity = () => {
  const { data, isLoading } = useNotifications({ limit: 8 });
  const items = data?.data || [];

  return (
    <Card title="Recent Activity" icon={Bell}>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No recent activity" />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item._id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-medium text-text">{item.title}</p>
                <p className="text-muted">{item.message}</p>
              </div>
              <span className="shrink-0 whitespace-nowrap text-xs text-muted">{timeAgo(item.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
