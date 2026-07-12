import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ModuleTabs } from './ModuleTabs';
import { Confetti } from '@/components/ui/Confetti';
import { useSocket, CONFETTI_EVENT } from '@/hooks/useSocket';

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
  const [confettiKey, setConfettiKey] = useState(null);
  const location = useLocation();
  useSocket();

  useEffect(() => {
    const handleConfetti = () => setConfettiKey(Date.now());
    window.addEventListener(CONFETTI_EVENT, handleConfetti);
    return () => window.removeEventListener(CONFETTI_EVENT, handleConfetti);
  }, []);

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
      {confettiKey && <Confetti key={confettiKey} onDone={() => setConfettiKey(null)} />}
    </div>
  );
};
