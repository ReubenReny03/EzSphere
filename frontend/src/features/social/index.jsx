import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/Tabs';
import { ActivitiesTab } from './ActivitiesTab';
import { ParticipationQueueTab } from './ParticipationQueueTab';
import { DiversityTab } from './DiversityTab';

const TABS = [
  { value: 'activities', label: 'CSR Activities' },
  { value: 'participation', label: 'Employee Participation' },
  { value: 'diversity', label: 'Diversity Dashboard' },
];

const Social = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tab') || 'activities';

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={TABS} active={active} onChange={(tab) => setSearchParams({ tab })} accent="social" />
      {active === 'activities' && <ActivitiesTab />}
      {active === 'participation' && <ParticipationQueueTab />}
      {active === 'diversity' && <DiversityTab />}
    </div>
  );
};

export default Social;
