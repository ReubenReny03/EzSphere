import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ModuleTabs } from './ModuleTabs';
import { useSocket } from '@/hooks/useSocket';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/environmental': 'Environmental',
  '/social': 'Social',
  '/governance': 'Governance',
  '/gamification': 'Gamification',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export const AppShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useSocket();

  const title = PAGE_TITLES[location.pathname] || 'EcoSphere';

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <ModuleTabs />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
