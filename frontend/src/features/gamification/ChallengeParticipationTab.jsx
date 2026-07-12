import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/context/AuthContext';
import {
  useChallengeParticipation,
  useApproveChallengeParticipation,
  useRejectChallengeParticipation,
} from '@/api/hooks/useChallenges';

export const ChallengeParticipationTab = () => {
  const { user } = useAuth();
  const canReview = user?.role === 'admin' || user?.role === 'manager';
  const { data, isLoading } = useChallengeParticipation({ status: 'Pending', limit: 50 });
  const approve = useApproveChallengeParticipation();
  const reject = useRejectChallengeParticipation();

  const handleApprove = async (id) => {
    try {
      await approve.mutateAsync(id);
      toast.success('Participation approved');
    } catch (err) {
      // handled globally
    }
  };

  const handleReject = async (id) => {
    try {
      await reject.mutateAsync(id);
      toast.success('Participation rejected');
    } catch (err) {
      // handled globally
    }
  };

  const columns = [
    { key: 'employee', header: 'Employee', renderCell: (row) => row.employee?.name },
    { key: 'challenge', header: 'Challenge', renderCell: (row) => row.challenge?.title },
    { key: 'progress', header: 'Progress', renderCell: (row) => <ProgressBar value={row.progress} accent="game" className="w-32" /> },
    ...(canReview
      ? [
          {
            key: 'actions',
            header: '',
            renderCell: (row) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="game" loading={approve.isPending} onClick={() => handleApprove(row._id)}>
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </Button>
                <Button size="sm" variant="danger" loading={reject.isPending} onClick={() => handleReject(row._id)}>
                  <X className="h-3.5 w-3.5" />
                  Reject
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No pending challenge participation" />;
};
