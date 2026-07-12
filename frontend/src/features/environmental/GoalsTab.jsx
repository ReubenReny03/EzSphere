import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { useGoals, useDeleteGoal } from '@/api/hooks/useGoals';
import { formatDate } from '@/lib/format';
import { GoalModal } from './GoalModal';

export const GoalsTab = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const { data, isLoading } = useGoals({ limit: 100 });
  const deleteGoal = useDeleteGoal();

  const goals = (data?.data || []).filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await deleteGoal.mutateAsync(id);
      toast.success('Goal deleted');
    } catch (err) {
      // handled globally
    }
  };

  const columns = [
    { key: 'name', header: 'Goal' },
    { key: 'department', header: 'Department', renderCell: (row) => row.department?.name },
    { key: 'metric', header: 'Metric' },
    {
      key: 'progress',
      header: 'Progress',
      renderCell: (row) => <ProgressBar value={row.progress ?? Math.min(100, Math.round((row.currentValue / row.targetValue) * 100))} className="w-40" />,
    },
    { key: 'status', header: 'Status', renderCell: (row) => <Badge status={row.status} context="goal" /> },
    { key: 'deadline', header: 'Deadline', renderCell: (row) => formatDate(row.deadline) },
    {
      key: 'actions',
      header: '',
      renderCell: (row) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => handleEdit(row)} aria-label="Edit goal" className="text-muted hover:text-text">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => handleDelete(row._id)} aria-label="Delete goal" className="text-muted hover:text-danger">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input placeholder="Search goals..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button
          variant="env"
          size="sm"
          onClick={() => {
            setEditingGoal(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      <Table columns={columns} data={goals} loading={isLoading} emptyMessage="No environmental goals yet" />

      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} goal={editingGoal} />
    </div>
  );
};
