import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useCategories, useDeleteCategory } from '@/api/hooks/useCategories';
import { CategoryModal } from './CategoryModal';

export const CategoriesTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { data, isLoading } = useCategories({ limit: 100 });
  const deleteCategory = useDeleteCategory();

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this category?')) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Category deactivated');
    } catch (err) {
      // handled globally
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    {
      key: 'actions',
      header: '',
      renderCell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingCategory(row);
              setModalOpen(true);
            }}
            aria-label="Edit category"
            className="text-muted hover:text-text"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => handleDelete(row._id)} aria-label="Deactivate category" className="text-muted hover:text-danger">
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
            setEditingCategory(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>
      <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No categories yet" />
      <CategoryModal open={modalOpen} onClose={() => setModalOpen(false)} category={editingCategory} />
    </div>
  );
};
