import { FileBarChart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

const REPORT_CARDS = ['Environmental Report', 'Social Report', 'Governance Report', 'ESG Summary'];

const Reports = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {REPORT_CARDS.map((title) => (
        <Card key={title} title={title} icon={FileBarChart}>
          <EmptyState message="Report generation & export ship in Phase 1" />
        </Card>
      ))}
    </div>
  </div>
);

export default Reports;
