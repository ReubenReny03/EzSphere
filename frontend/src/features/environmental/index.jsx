import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/Tabs';
import { EmissionFactorsTab } from './EmissionFactorsTab';
import { ProductsTab } from './ProductsTab';
import { CarbonTransactionsTab } from './CarbonTransactionsTab';
import { GoalsTab } from './GoalsTab';

const TABS = [
  { value: 'goals', label: 'Environmental Goals' },
  { value: 'carbon', label: 'Carbon Transactions' },
  { value: 'emission-factors', label: 'Emission Factors' },
  { value: 'products', label: 'Product ESG Profiles' },
];

const Environmental = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tab') || 'goals';

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={TABS} active={active} onChange={(tab) => setSearchParams({ tab })} accent="env" />
      {active === 'goals' && <GoalsTab />}
      {active === 'carbon' && <CarbonTransactionsTab />}
      {active === 'emission-factors' && <EmissionFactorsTab />}
      {active === 'products' && <ProductsTab />}
    </div>
  );
};

export default Environmental;
