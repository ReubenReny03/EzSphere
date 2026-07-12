import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Play, FileDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDepartments } from '@/api/hooks/useDepartments';
import { useRunCustomReport, downloadCustomReport } from '@/api/hooks/useReports';

const MODULE_OPTIONS = [
  { value: 'environmental', label: 'Environmental' },
  { value: 'social', label: 'Social' },
  { value: 'governance', label: 'Governance' },
  { value: 'gamification', label: 'Gamification' },
];

const ESG_CATEGORY_OPTIONS = [
  { value: 'Environmental', label: 'Environmental' },
  { value: 'Social', label: 'Social' },
  { value: 'Governance', label: 'Governance' },
  { value: 'Ethics', label: 'Ethics' },
];

export const CustomReportBuilder = () => {
  const { data: depts } = useDepartments({ limit: 100 });
  const runReport = useRunCustomReport();
  const [exporting, setExporting] = useState(null);
  const { register, handleSubmit, getValues } = useForm({ defaultValues: { module: 'environmental' } });

  const buildFilters = (values) => {
    const filters = { module: values.module };
    if (values.department) filters.department = values.department;
    if (values.employee) filters.employee = values.employee;
    if (values.challenge) filters.challenge = values.challenge;
    if (values.esgCategory) filters.esgCategory = values.esgCategory;
    if (values.dateFrom || values.dateTo) {
      filters.dateRange = {
        ...(values.dateFrom ? { from: values.dateFrom } : {}),
        ...(values.dateTo ? { to: values.dateTo } : {}),
      };
    }
    return filters;
  };

  const onSubmit = async (values) => {
    try {
      await runReport.mutateAsync(buildFilters(values));
    } catch (err) {
      // handled globally
    }
  };

  const handleExport = async (format) => {
    setExporting(format);
    try {
      await downloadCustomReport(buildFilters(getValues()), format);
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(null);
    }
  };

  const report = runReport.data?.data;

  return (
    <Card title="Custom Report Builder">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Select label="Module" options={MODULE_OPTIONS} {...register('module')} />
        <Select
          label="Department"
          placeholder="Any"
          options={(depts?.data || []).map((d) => ({ value: d._id, label: d.name }))}
          {...register('department')}
        />
        <Select label="ESG Category" placeholder="Any" options={ESG_CATEGORY_OPTIONS} {...register('esgCategory')} />
        <Input label="Employee ID" placeholder="Optional" {...register('employee')} />
        <Input label="Challenge ID" placeholder="Optional" {...register('challenge')} />
        <div className="grid grid-cols-2 gap-2">
          <Input label="From" type="date" {...register('dateFrom')} />
          <Input label="To" type="date" {...register('dateTo')} />
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" loading={runReport.isPending} onClick={handleSubmit(onSubmit)}>
          <Play className="h-3.5 w-3.5" />
          Run Report
        </Button>
        {report && (
          <>
            <Button size="sm" variant="ghost" loading={exporting === 'pdf'} onClick={() => handleExport('pdf')}>
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Button size="sm" variant="ghost" loading={exporting === 'excel'} onClick={() => handleExport('excel')}>
              <FileDown className="h-3.5 w-3.5" />
              Excel
            </Button>
            <Button size="sm" variant="ghost" loading={exporting === 'csv'} onClick={() => handleExport('csv')}>
              <FileDown className="h-3.5 w-3.5" />
              CSV
            </Button>
          </>
        )}
      </div>

      <div className="mt-4">
        {report && report.rows.length === 0 && <EmptyState message="No rows matched these filters" />}
        {report && report.rows.length > 0 && (
          <Table columns={report.columns.map((c) => ({ key: c.key, header: c.label }))} data={report.rows} keyField={report.columns[0]?.key} />
        )}
      </div>
    </Card>
  );
};
