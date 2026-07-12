import toast from 'react-hot-toast';
import { Zap, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/format';
import { useJoinChallenge } from '@/api/hooks/useChallenges';

const DIFFICULTY_CLASSES = {
  Easy: 'bg-success/10 text-success',
  Medium: 'bg-warning/10 text-warning',
  Hard: 'bg-danger/10 text-danger',
};

export const ChallengeCard = ({ challenge }) => {
  const join = useJoinChallenge();

  const handleJoin = async () => {
    try {
      await join.mutateAsync(challenge._id);
      toast.success('Joined challenge');
    } catch (err) {
      // handled globally
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-text">{challenge.title}</h3>
        <Badge status={challenge.status} />
      </div>
      <p className="mt-1 text-sm text-muted">{challenge.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1 text-game">
          <Zap className="h-3.5 w-3.5" />
          {challenge.xp} XP
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs ${DIFFICULTY_CLASSES[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(challenge.deadline)}
        </span>
      </div>
      {challenge.status === 'Active' && (
        <Button size="sm" variant="game" className="mt-4" loading={join.isPending} onClick={handleJoin}>
          Join Challenge
        </Button>
      )}
    </Card>
  );
};
