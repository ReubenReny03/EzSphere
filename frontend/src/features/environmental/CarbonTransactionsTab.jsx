import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useCarbonList } from '@/api/hooks/useCarbon';
import { formatDate, formatCO2 } from '@/lib/format';
import { LogCarbonModal } from '@/features/dashboard/LogCarbonModal';

export const CarbonTransactionsTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useCarbonList({ limit: 50 });
  const rows = data?.data || [];

  const columns = [
    { key: 'date', header: 'Date', renderCell: (row) => formatDate(row.date) },
    { key: 'department', header: 'Department', renderCell: (row) => row.department?.name },
    { key: 'sourceType', header: 'Source Type' },
    { key: 'sourceRef', header: 'Reference' },
    { key: 'activityData', header: 'Quantity', numeric: true },
    { key: 'co2Amount', header: 'CO₂e', numeric: true, renderCell: (row) => formatCO2(row.co2Amount) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="env" size="sm" onClick={() => setModalOpen(true)}>
          <Zap className="h-4 w-4" />
          Generate Transaction
        </Button>
      </div>
      <Table columns={columns} data={rows} loading={isLoading} emptyMessage="No carbon transactions recorded yet" />
      <LogCarbonModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
