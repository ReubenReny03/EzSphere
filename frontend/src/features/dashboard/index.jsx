import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Trophy, FileBarChart } from 'lucide-react';
import { StatTile } from '@/components/ui/StatTile';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useScoringOverview } from '@/api/hooks/useScores';
import { EmissionsTrendChart } from './EmissionsTrendChart';
import { DepartmentRankingChart } from './DepartmentRankingChart';
import { RecentActivity } from './RecentActivity';
import { LogCarbonModal } from './LogCarbonModal';

const Dashboard = () => {
  const { data, isLoading } = useScoringOverview();
  const overview = data?.data;
  const navigate = useNavigate();
  const [logCarbonOpen, setLogCarbonOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />) // eslint-disable-line react/no-array-index-key
        ) : (
          <>
            <StatTile label="Environmental" value={overview?.environmental ?? 0} accent="env" />
            <StatTile label="Social" value={overview?.social ?? 0} accent="social" />
            <StatTile label="Governance" value={overview?.governance ?? 0} accent="gov" />
            <StatTile label="Overall ESG" value={overview?.overall ?? 0} accent="text" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmissionsTrendChart />
        <DepartmentRankingChart />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <Card title="Quick Actions">
          <div className="flex flex-col gap-2">
            <Button variant="env" size="sm" onClick={() => setLogCarbonOpen(true)}>
              <Zap className="h-4 w-4" />
              Log Carbon
            </Button>
            <Button variant="game" size="sm" onClick={() => navigate('/gamification?tab=challenges')}>
              <Trophy className="h-4 w-4" />
              Start Challenge
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
              <FileBarChart className="h-4 w-4" />
              View Reports
            </Button>
          </div>
        </Card>
      </div>

      <LogCarbonModal open={logCarbonOpen} onClose={() => setLogCarbonOpen(false)} />
    </div>
  );
};

export default Dashboard;
