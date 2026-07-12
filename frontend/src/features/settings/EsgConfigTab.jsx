import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSettings, useUpdateSettings } from '@/api/hooks/useSettings';

const FLAG_FIELDS = [
  { key: 'autoEmissionCalc', label: 'Auto Emission Calculation', description: 'Automatically compute CO₂e from activity data + emission factors.' },
  { key: 'evidenceRequired', label: 'Evidence Required', description: 'Require proof before approving CSR/challenge participation.' },
  { key: 'autoAwardBadges', label: 'Auto-Award Badges', description: 'Automatically unlock badges when a threshold is met.' },
];

export const EsgConfigTab = () => {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const settings = data?.data;

  const handleToggle = async (key, value) => {
    try {
      await updateSettings.mutateAsync({ flags: { [key]: value } });
      toast.success('Setting updated');
    } catch (err) {
      // handled globally
    }
  };

  const handleWeightChange = async (key, value) => {
    try {
      await updateSettings.mutateAsync({ esgWeights: { [key]: value } });
    } catch (err) {
      // handled globally
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="flex flex-col gap-6">
      <Card title="Business Rule Toggles">
        <div className="divide-y divide-border">
          {FLAG_FIELDS.map((field) => (
            <Toggle
              key={field.key}
              label={field.label}
              description={field.description}
              checked={!!settings?.flags?.[field.key]}
              onChange={(value) => handleToggle(field.key, value)}
            />
          ))}
        </div>
      </Card>

      <Card title="ESG Score Weights">
        {['environmental', 'social', 'governance'].map((key) => (
          <div key={key} className="mb-4 last:mb-0">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="capitalize text-text">{key}</span>
              <span className="text-muted">{Math.round((settings?.esgWeights?.[key] ?? 0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              defaultValue={settings?.esgWeights?.[key] ?? 0}
              onMouseUp={(e) => handleWeightChange(key, Number(e.target.value))}
              onTouchEnd={(e) => handleWeightChange(key, Number(e.target.value))}
              className="w-full accent-env"
            />
          </div>
        ))}
      </Card>
    </div>
  );
};
