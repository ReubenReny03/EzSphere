import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/Tabs';
import { DepartmentsTab } from './DepartmentsTab';
import { CategoriesTab } from './CategoriesTab';
import { EsgConfigTab } from './EsgConfigTab';
import { NotificationSettingsTab } from './NotificationSettingsTab';

const TABS = [
  { value: 'departments', label: 'Departments' },
  { value: 'categories', label: 'Categories' },
  { value: 'esg-config', label: 'ESG Configuration' },
  { value: 'notifications', label: 'Notification Settings' },
];

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tab') || 'departments';

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={TABS} active={active} onChange={(tab) => setSearchParams({ tab })} accent="muted" />
      {active === 'departments' && <DepartmentsTab />}
      {active === 'categories' && <CategoriesTab />}
      {active === 'esg-config' && <EsgConfigTab />}
      {active === 'notifications' && <NotificationSettingsTab />}
    </div>
  );
};

export default SettingsPage;
