import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/Tabs';
import { PoliciesTab } from './PoliciesTab';
import { AcknowledgementsTab } from './AcknowledgementsTab';
import { AuditsTab } from './AuditsTab';
import { ComplianceTab } from './ComplianceTab';

const TABS = [
  { value: 'policies', label: 'Policies' },
  { value: 'acknowledgements', label: 'Policy Acknowledgements' },
  { value: 'audits', label: 'Audits' },
  { value: 'compliance', label: 'Compliance Issues' },
];

const Governance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tab') || 'compliance';

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={TABS} active={active} onChange={(tab) => setSearchParams({ tab })} accent="gov" />
      {active === 'policies' && <PoliciesTab />}
      {active === 'acknowledgements' && <AcknowledgementsTab />}
      {active === 'audits' && <AuditsTab />}
      {active === 'compliance' && <ComplianceTab />}
    </div>
  );
};

export default Governance;
