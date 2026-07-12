import toast from 'react-hot-toast';
import { Gift } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { useRewards } from '@/api/hooks/useBadgesRewards';
import { useRedeemReward } from '@/api/hooks/useRewardRedemption';

export const RewardsTab = () => {
  const { user } = useAuth();
  const { data, isLoading } = useRewards({ status: 'active', limit: 50 });
  const redeem = useRedeemReward();
  const rewards = data?.data || [];

  const handleRedeem = async (reward) => {
    try {
      await redeem.mutateAsync(reward._id);
      toast.success(`Redeemed "${reward.name}"`);
    } catch (err) {
      // handled globally
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  if (rewards.length === 0) return <EmptyState icon={Gift} message="No rewards available yet" />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rewards.map((reward) => {
        const canAfford = (user?.pointsBalance ?? 0) >= reward.pointsRequired;
        return (
          <Card key={reward._id}>
            <h3 className="font-semibold text-text">{reward.name}</h3>
            <p className="mt-1 text-sm text-muted">{reward.description}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-game">{reward.pointsRequired} pts</span>
              <span className="text-muted">{reward.stock} in stock</span>
            </div>
            <Button
              size="sm"
              variant="game"
              className="mt-4 w-full"
              disabled={reward.stock === 0 || !canAfford}
              loading={redeem.isPending}
              onClick={() => handleRedeem(reward)}
            >
              {reward.stock === 0 ? 'Out of Stock' : canAfford ? 'Redeem' : 'Not Enough Points'}
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
