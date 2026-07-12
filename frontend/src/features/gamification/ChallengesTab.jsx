import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useChallenges } from '@/api/hooks/useChallenges';
import { ChallengeCard } from './ChallengeCard';

const STATUSES = ['Draft', 'Active', 'Under Review', 'Completed', 'Archived'];

export const ChallengesTab = () => {
  const [statusFilter, setStatusFilter] = useState(null);
  const { data, isLoading } = useChallenges({ limit: 50, ...(statusFilter ? { status: statusFilter } : {}) });
  const challenges = data?.data || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter(null)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium',
            !statusFilter ? 'border-game bg-game/10 text-game' : 'border-border text-muted hover:text-text',
          )}
        >
          All
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium',
              statusFilter === status ? 'border-game bg-game/10 text-game' : 'border-border text-muted hover:text-text',
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <EmptyState message="No challenges match this filter" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge._id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
};
