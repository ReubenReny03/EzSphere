import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSettings, useUpdateSettings } from '@/api/hooks/useSettings';

const NOTIFICATION_FIELDS = [
  { key: 'notifyNewCompliance', label: 'New Compliance Issues', description: 'Notify the owner when a compliance issue is raised.' },
  { key: 'notifyApproval', label: 'Approval Decisions', description: 'Notify employees when their participation is approved/rejected.' },
  { key: 'notifyPolicyReminder', label: 'Policy Reminders', description: 'Remind employees to acknowledge required policies.' },
  { key: 'notifyBadgeUnlock', label: 'Badge Unlocks', description: 'Notify employees when they unlock a new badge.' },
  { key: 'emailAlerts', label: 'Email Alerts', description: 'Also send notifications via email (stubbed).' },
];

export const NotificationSettingsTab = () => {
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

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card title="Notification Settings">
      <div className="divide-y divide-border">
        {NOTIFICATION_FIELDS.map((field) => (
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
  );
};
