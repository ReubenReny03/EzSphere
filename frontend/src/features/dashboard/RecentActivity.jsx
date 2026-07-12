import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotifications } from '@/api/hooks/useNotifications';
import { LIVE_FEED_KEY } from '@/lib/liveFeed';
import { timeAgo } from '@/lib/format';

export const RecentActivity = () => {
  const { data, isLoading } = useNotifications({ limit: 8 });
  // Client-only cache fed by socket events (CARBON_NEW, LEADERBOARD_UPDATE,
  // BADGE_UNLOCKED) — merges with persisted notifications so the feed
  // reflects realtime events even when they don't produce a Notification doc.
  const { data: liveFeed = [] } = useQuery({
    queryKey: LIVE_FEED_KEY,
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  });

  const items = [...liveFeed, ...(data?.data || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

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
            <li key={item._id || item.id} className="flex items-start justify-between gap-3 text-sm">
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
