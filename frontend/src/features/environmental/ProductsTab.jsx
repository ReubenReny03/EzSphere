import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useProducts, useDeleteProduct } from '@/api/hooks/useProducts';
import { formatCO2 } from '@/lib/format';
import { ProductModal } from './ProductModal';

export const ProductsTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { data, isLoading } = useProducts({ limit: 100 });
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product profile?')) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product profile deactivated');
    } catch (err) {
      // handled globally
    }
  };

  const columns = [
    { key: 'name', header: 'Product' },
    { key: 'sku', header: 'SKU' },
    { key: 'department', header: 'Department', renderCell: (row) => row.department?.name },
    { key: 'carbonFootprint', header: 'Carbon Footprint', numeric: true, renderCell: (row) => formatCO2(row.carbonFootprint) },
    { key: 'recyclablePct', header: 'Recyclable %', numeric: true, renderCell: (row) => `${row.recyclablePct}%` },
    { key: 'ethicalSourcingScore', header: 'Ethical Sourcing', numeric: true, renderCell: (row) => `${row.ethicalSourcingScore} / 100` },
    {
      key: 'actions',
      header: '',
      renderCell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(row);
              setModalOpen(true);
            }}
            aria-label="Edit product"
            className="text-muted hover:text-text"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => handleDelete(row._id)} aria-label="Deactivate product" className="text-muted hover:text-danger">
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
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Product Profile
        </Button>
      </div>
      <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No product ESG profiles yet" />
      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} product={editingProduct} />
    </div>
  );
};
