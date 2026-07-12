import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useAudits } from '@/api/hooks/useCompliance';
import { formatDate } from '@/lib/format';

export const AuditsTab = () => {
  const { data, isLoading } = useAudits({ limit: 100 });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'department', header: 'Department', renderCell: (row) => row.department?.name },
    { key: 'auditor', header: 'Auditor' },
    { key: 'date', header: 'Date', renderCell: (row) => formatDate(row.date) },
    { key: 'findingsCount', header: 'Findings', numeric: true },
    { key: 'status', header: 'Status', renderCell: (row) => <Badge status={row.status} context="audit" /> },
  ];

  return <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No audits recorded yet" />;
};
