import { Table } from '@/components/ui/Table';
import { usePolicyAcknowledgements } from '@/api/hooks/usePolicies';
import { formatDate } from '@/lib/format';

export const AcknowledgementsTab = () => {
  const { data, isLoading } = usePolicyAcknowledgements({ limit: 100 });

  const columns = [
    { key: 'employee', header: 'Employee', renderCell: (row) => row.employee?.name },
    { key: 'policy', header: 'Policy', renderCell: (row) => row.policy?.title },
    { key: 'acknowledgedAt', header: 'Acknowledged', renderCell: (row) => formatDate(row.acknowledgedAt) },
  ];

  return <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No acknowledgements recorded yet" />;
};
