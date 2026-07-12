import { Bell, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/api/hooks/useNotifications';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { timeAgo } from '@/lib/format';
import { cn } from '@/lib/cn';

export const NotificationPanel = ({ onClose }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications({ limit: 10 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications = data?.data ?? [];

  const handleSelect = (notification) => {
    if (!notification.read) markRead.mutate(notification._id);
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 z-10 mt-2 w-80 animate-fade-in rounded-lg border border-border bg-surface p-2 shadow-elevated">
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-sm font-semibold tracking-tight text-text">Notifications</span>
        <button
          type="button"
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending || notifications.every((n) => n.read)}
          className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} message="No notifications yet" />
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              type="button"
              onClick={() => handleSelect(notification)}
              className={cn(
                'flex w-full flex-col gap-0.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-surface2',
                !notification.read && 'bg-surface2/60',
              )}
            >
              <div className="flex items-center gap-2">
                {!notification.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-info" />}
                <span className="text-sm font-medium text-text">{notification.title}</span>
              </div>
              {notification.message && <p className="text-xs text-muted">{notification.message}</p>}
              <span className="text-[11px] text-muted">{timeAgo(notification.createdAt)}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
