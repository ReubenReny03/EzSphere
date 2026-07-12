import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { usePolicies, usePolicyAcknowledgements, useAcknowledgePolicy } from '@/api/hooks/usePolicies';
import { formatDate } from '@/lib/format';

const MyAcknowledgements = () => {
  const { user } = useAuth();
  const { data: policiesData, isLoading: policiesLoading } = usePolicies({ status: 'active', limit: 100 });
  const { data: ackData, isLoading: acksLoading } = usePolicyAcknowledgements({ employee: user?._id, limit: 100 });
  const acknowledge = useAcknowledgePolicy();

  const required = (policiesData?.data || []).filter((p) => p.requiresAcknowledgement);
  const acknowledgedIds = new Set((ackData?.data || []).map((a) => a.policy?._id));
  const pending = required.filter((p) => !acknowledgedIds.has(p._id));

  const handleAcknowledge = async (policyId) => {
    try {
      await acknowledge.mutateAsync(policyId);
      toast.success('Policy acknowledged');
    } catch (err) {
      // handled globally
    }
  };

  if (policiesLoading || acksLoading) return <Skeleton className="h-32 w-full" />;

  return (
    <Card title="Your Pending Acknowledgements">
      {pending.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          You&apos;re up to date on all required policies.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {pending.map((policy) => (
            <li key={policy._id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-text">{policy.title}</p>
                <p className="text-xs text-muted">{policy.category} · effective {formatDate(policy.effectiveDate)}</p>
              </div>
              <Button size="sm" variant="gov" loading={acknowledge.isPending} onClick={() => handleAcknowledge(policy._id)}>
                Acknowledge
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export const AcknowledgementsTab = () => {
  const { data, isLoading } = usePolicyAcknowledgements({ limit: 100 });

  const columns = [
    { key: 'employee', header: 'Employee', renderCell: (row) => row.employee?.name },
    { key: 'policy', header: 'Policy', renderCell: (row) => row.policy?.title },
    { key: 'acknowledgedAt', header: 'Acknowledged', renderCell: (row) => formatDate(row.acknowledgedAt) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <MyAcknowledgements />
      <Card title="All Acknowledgements">
        {(!data?.data || data.data.length === 0) && !isLoading ? (
          <EmptyState message="No acknowledgements recorded yet" />
        ) : (
          <Table columns={columns} data={data?.data} loading={isLoading} />
        )}
      </Card>
    </div>
  );
};
