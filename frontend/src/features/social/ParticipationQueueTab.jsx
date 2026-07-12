import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useCSRQueue, useApproveCSRParticipation, useRejectCSRParticipation } from '@/api/hooks/useCSR';
import { formatDate } from '@/lib/format';

export const ParticipationQueueTab = () => {
  const { user } = useAuth();
  const canReview = user?.role === 'admin' || user?.role === 'manager';
  const { data, isLoading } = useCSRQueue({ status: 'Pending', limit: 50 });
  const approve = useApproveCSRParticipation();
  const reject = useRejectCSRParticipation();

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
    { key: 'activity', header: 'Activity', renderCell: (row) => row.activity?.title },
    {
      key: 'evidence',
      header: 'Evidence',
      renderCell: (row) => (row.proof ? <Badge status="Approved" /> : row.activity?.evidenceRequired ? <Badge status="Rejected" /> : '—'),
    },
    { key: 'createdAt', header: 'Submitted', renderCell: (row) => formatDate(row.createdAt) },
    ...(canReview
      ? [
          {
            key: 'actions',
            header: '',
            renderCell: (row) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="env" loading={approve.isPending} onClick={() => handleApprove(row._id)}>
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

  return <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No pending participation to review" />;
};
