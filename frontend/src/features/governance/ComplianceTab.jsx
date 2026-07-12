import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCompliance } from '@/api/hooks/useCompliance';
import { useLeaderboard } from '@/api/hooks/useLeaderboard';
import { formatDate } from '@/lib/format';
import { ComplianceIssueModal } from './ComplianceIssueModal';

export const ComplianceTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const { data, isLoading } = useCompliance({ limit: 100 });
  const { data: usersData } = useLeaderboard({ scope: 'global', limit: 100 });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'owner', header: 'Owner', renderCell: (row) => row.owner?.name },
    { key: 'severity', header: 'Severity', renderCell: (row) => <Badge status={row.severity} /> },
    { key: 'status', header: 'Status', renderCell: (row) => <Badge status={row.status} /> },
    {
      key: 'dueDate',
      header: 'Due Date',
      renderCell: (row) => (
        <span className={cn(row.isOverdue && 'font-semibold text-danger')}>
          {formatDate(row.dueDate)}
          {row.isOverdue && ' (Overdue)'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      renderCell: (row) => (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setEditingIssue(row);
              setModalOpen(true);
            }}
            aria-label="Edit compliance issue"
            className="text-muted hover:text-text"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="gov"
          size="sm"
          onClick={() => {
            setEditingIssue(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Raise Issue
        </Button>
      </div>
      <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No compliance issues yet" />
      <ComplianceIssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        issue={editingIssue}
        users={usersData?.data || []}
      />
    </div>
  );
};
