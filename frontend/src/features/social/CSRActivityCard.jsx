import { useRef, useState } from 'react';
import { Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/format';
import { useJoinCSRActivity } from '@/api/hooks/useCSR';

export const CSRActivityCard = ({ activity }) => {
  const [joined, setJoined] = useState(false);
  const fileInputRef = useRef(null);
  const join = useJoinCSRActivity();

  const handleJoin = async () => {
    try {
      const proofFile = fileInputRef.current?.files?.[0];
      await join.mutateAsync({ id: activity._id, proofFile });
      setJoined(true);
      toast.success('Joined activity');
    } catch (err) {
      // handled globally
    }
  };

  const full = activity.capacity && activity.joinedCount >= activity.capacity;

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-text">{activity.title}</h3>
        {activity.evidenceRequired && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-xs text-warning">
            <ShieldAlert className="h-3 w-3" />
            Evidence Required
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">{activity.description}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span>{formatDate(activity.date)}</span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {activity.joinedCount}
          {activity.capacity ? ` / ${activity.capacity}` : ''} joined
        </span>
      </div>
      <div className="mt-4">
        {activity.evidenceRequired && !joined && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="mb-2 block w-full text-xs text-muted file:mr-2 file:rounded-md file:border-0 file:bg-surface2 file:px-2 file:py-1 file:text-xs file:text-text"
          />
        )}
        {joined ? (
          <span className="flex items-center gap-1 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Joined
          </span>
        ) : (
          <Button size="sm" variant="social" disabled={full} loading={join.isPending} onClick={handleJoin}>
            {full ? 'Full' : 'Join Activity'}
          </Button>
        )}
      </div>
    </Card>
  );
};
