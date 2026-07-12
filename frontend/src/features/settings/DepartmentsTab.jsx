import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useDepartments, useDeleteDepartment } from '@/api/hooks/useDepartments';
import { DepartmentModal } from './DepartmentModal';

export const DepartmentsTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const { data, isLoading } = useDepartments({ limit: 100 });
  const deleteDept = useDeleteDepartment();

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this department?')) return;
    try {
      await deleteDept.mutateAsync(id);
      toast.success('Department deactivated');
    } catch (err) {
      // handled globally
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
    { key: 'employeeCount', header: 'Employees', numeric: true },
    { key: 'diversityScore', header: 'Diversity Score', numeric: true },
    {
      key: 'actions',
      header: '',
      renderCell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingDept(row);
              setModalOpen(true);
            }}
            aria-label="Edit department"
            className="text-muted hover:text-text"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => handleDelete(row._id)} aria-label="Deactivate department" className="text-muted hover:text-danger">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditingDept(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Department
        </Button>
      </div>
      <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No departments yet" />
      <DepartmentModal open={modalOpen} onClose={() => setModalOpen(false)} department={editingDept} />
    </div>
  );
};
