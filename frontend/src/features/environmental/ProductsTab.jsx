import { Table } from '@/components/ui/Table';
import { useProducts } from '@/api/hooks/useProducts';
import { formatCO2 } from '@/lib/format';

export const ProductsTab = () => {
  const { data, isLoading } = useProducts({ limit: 100 });

  const columns = [
    { key: 'name', header: 'Product' },
    { key: 'sku', header: 'SKU' },
    { key: 'department', header: 'Department', renderCell: (row) => row.department?.name },
    { key: 'carbonFootprint', header: 'Carbon Footprint', numeric: true, renderCell: (row) => formatCO2(row.carbonFootprint) },
    { key: 'recyclablePct', header: 'Recyclable %', numeric: true, renderCell: (row) => `${row.recyclablePct}%` },
    { key: 'ethicalSourcingScore', header: 'Ethical Sourcing', numeric: true, renderCell: (row) => `${row.ethicalSourcingScore} / 100` },
  ];

  return <Table columns={columns} data={data?.data} loading={isLoading} emptyMessage="No product ESG profiles yet" />;
};
