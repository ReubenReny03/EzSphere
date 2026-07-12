import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useBadges } from '@/api/hooks/useBadgesRewards';

export const BadgeGallery = () => {
  const { data, isLoading } = useBadges({ status: 'active', limit: 50 });
  const badges = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (badges.length === 0) return <EmptyState message="No badges configured yet" />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {badges.map((badge) => (
        <div key={badge._id} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center">
          <span className="text-3xl">{badge.icon || '🏅'}</span>
          <p className="text-sm font-semibold text-text">{badge.name}</p>
          <p className="text-xs text-muted">{badge.description}</p>
          <p className="text-xs text-game">
            {badge.unlockRule.metric} ≥ {badge.unlockRule.threshold}
          </p>
        </div>
      ))}
    </div>
  );
};
