import { useState } from 'react';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';
import { cn } from '@/lib/cn';

export const Topbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: queryKeys.notifications({ read: 'false' }),
    queryFn: () => apiClient.get('/notifications', { params: { read: 'false', limit: 1 } }).then((r) => r.meta?.total ?? 0),
    refetchInterval: 30000,
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className="text-muted lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-text">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="relative rounded-lg p-2 text-muted hover:bg-surface2 hover:text-text" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text hover:bg-surface2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface2">
              <User className="h-4 w-4 text-muted" />
            </span>
            <span className="hidden sm:inline">{user?.name}</span>
          </button>
          {menuOpen && (
            <div className={cn('absolute right-0 z-10 mt-2 w-40 rounded-lg border border-border bg-surface p-1 shadow-lg')}>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text hover:bg-surface2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
