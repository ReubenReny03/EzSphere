import { Table } from '@/components/ui/Table';
import { usePolicies } from '@/api/hooks/usePolicies';
import { formatDate } from '@/lib/format';

export const PoliciesTab = () => {
  const { data, isLoading } = usePolicies({ limit: 100 });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    { key: 'version', header: 'Version' },
    { key: 'effectiveDate', header: 'Effective Date', renderCell: (row) => formatDate(row.effectiveDate) },
    {
      key: 'requiresAcknowledgement',
      header: 'Requires Ack.',
      renderCell: (row) => (row.requiresAcknowledgement ? 'Yes' : 'No'),
    },
  ];

  return <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No ESG policies yet" />;
};
