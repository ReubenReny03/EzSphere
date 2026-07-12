import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAudits } from '@/api/hooks/useCompliance';
import { formatDate } from '@/lib/format';
import { AuditModal } from './AuditModal';

export const AuditsTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState(null);
  const { data, isLoading } = useAudits({ limit: 100 });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'department', header: 'Department', renderCell: (row) => row.department?.name },
    { key: 'auditor', header: 'Auditor' },
    { key: 'date', header: 'Date', renderCell: (row) => formatDate(row.date) },
    { key: 'findingsCount', header: 'Findings', numeric: true },
    { key: 'status', header: 'Status', renderCell: (row) => <Badge status={row.status} context="audit" /> },
    {
      key: 'actions',
      header: '',
      renderCell: (row) => (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setEditingAudit(row);
              setModalOpen(true);
            }}
            aria-label="Edit audit"
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
            setEditingAudit(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Audit
        </Button>
      </div>
      <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No audits recorded yet" />
      <AuditModal open={modalOpen} onClose={() => setModalOpen(false)} audit={editingAudit} />
    </div>
  );
};
