import { useState } from 'react';
import { FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { downloadCannedReport } from '@/api/hooks/useReports';

const FORMATS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
];

export const ReportCard = ({ title, icon, type, query, params }) => {
  const [expanded, setExpanded] = useState(false);
  const [exporting, setExporting] = useState(null);
  const report = query.data?.data;

  const handleExport = async (format) => {
    setExporting(format);
    try {
      await downloadCannedReport(type, format, params);
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card title={title} icon={icon}>
      {query.isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : !report || report.rows.length === 0 ? (
        <EmptyState message="No data yet for this report" />
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">{report.rows.length} row(s) · generated {new Date(report.meta.generatedAt).toLocaleTimeString()}</p>

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 self-start text-sm text-social hover:underline"
          >
            {expanded ? 'Hide table' : 'View table'}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {expanded && (
            <Table
              columns={report.columns.map((c) => ({ key: c.key, header: c.label }))}
              data={report.rows}
              keyField={report.columns[0]?.key}
            />
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {FORMATS.map((f) => (
              <Button
                key={f.value}
                size="sm"
                variant="ghost"
                loading={exporting === f.value}
                onClick={() => handleExport(f.value)}
              >
                <FileDown className="h-3.5 w-3.5" />
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
