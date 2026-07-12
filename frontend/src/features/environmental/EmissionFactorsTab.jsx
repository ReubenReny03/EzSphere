import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useEmissionFactors, useDeleteEmissionFactor } from '@/api/hooks/useEmissionFactors';
import { EmissionFactorModal } from './EmissionFactorModal';

export const EmissionFactorsTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState(null);
  const { data, isLoading } = useEmissionFactors({ limit: 100 });
  const deleteFactor = useDeleteEmissionFactor();

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this emission factor?')) return;
    try {
      await deleteFactor.mutateAsync(id);
      toast.success('Emission factor deactivated');
    } catch (err) {
      // handled globally
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'activityType', header: 'Activity Type' },
    { key: 'unit', header: 'Unit' },
    { key: 'value', header: 'Value', numeric: true },
    { key: 'source', header: 'Source' },
    {
      key: 'actions',
      header: '',
      renderCell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingFactor(row);
              setModalOpen(true);
            }}
            aria-label="Edit factor"
            className="text-muted hover:text-text"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => handleDelete(row._id)} aria-label="Deactivate factor" className="text-muted hover:text-danger">
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
          variant="env"
          size="sm"
          onClick={() => {
            setEditingFactor(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Emission Factor
        </Button>
      </div>
      <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No emission factors yet" />
      <EmissionFactorModal open={modalOpen} onClose={() => setModalOpen(false)} factor={editingFactor} />
    </div>
  );
};
