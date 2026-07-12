import { Leaf, Users, ShieldCheck, FileBarChart } from 'lucide-react';
import { useEnvironmentalReport, useSocialReport, useGovernanceReport, useESGSummaryReport } from '@/api/hooks/useReports';
import { ReportCard } from './ReportCard';
import { CustomReportBuilder } from './CustomReportBuilder';

const Reports = () => {
  const environmental = useEnvironmentalReport({ months: 12 });
  const social = useSocialReport({});
  const governance = useGovernanceReport({});
  const esgSummary = useESGSummaryReport();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard title="Environmental Report" icon={Leaf} type="environmental" query={environmental} params={{ months: 12 }} />
        <ReportCard title="Social Report" icon={Users} type="social" query={social} params={{}} />
        <ReportCard title="Governance Report" icon={ShieldCheck} type="governance" query={governance} params={{}} />
        <ReportCard title="ESG Summary" icon={FileBarChart} type="esg-summary" query={esgSummary} params={{}} />
      </div>

      <CustomReportBuilder />
    </div>
  );
};

export default Reports;
