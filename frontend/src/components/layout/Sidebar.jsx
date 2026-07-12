import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Leaf,
  Users,
  ShieldCheck,
  Trophy,
  FileBarChart,
  Settings as SettingsIcon,
  ChevronDown,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import logo from '@/favicon.png';

const NAV_GROUPS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, accent: 'text' },
  {
    label: 'Environmental',
    path: '/environmental',
    icon: Leaf,
    accent: 'env',
    items: [
      { label: 'Emission Factors', tab: 'emission-factors' },
      { label: 'Product ESG Profiles', tab: 'products' },
      { label: 'Carbon Transactions', tab: 'carbon' },
      { label: 'Environmental Goals', tab: 'goals' },
    ],
  },
  {
    label: 'Social',
    path: '/social',
    icon: Users,
    accent: 'social',
    items: [
      { label: 'CSR Activities', tab: 'activities' },
      { label: 'Employee Participation', tab: 'participation' },
      { label: 'Diversity Dashboard', tab: 'diversity' },
    ],
  },
  {
    label: 'Governance',
    path: '/governance',
    icon: ShieldCheck,
    accent: 'gov',
    items: [
      { label: 'Policies', tab: 'policies' },
      { label: 'Policy Acknowledgements', tab: 'acknowledgements' },
      { label: 'Audits', tab: 'audits' },
      { label: 'Compliance Issues', tab: 'compliance' },
    ],
  },
  {
    label: 'Gamification',
    path: '/gamification',
    icon: Trophy,
    accent: 'game',
    items: [
      { label: 'Challenges', tab: 'challenges' },
      { label: 'Challenge Participation', tab: 'participation' },
      { label: 'Badges', tab: 'badges' },
      { label: 'Rewards', tab: 'rewards' },
      { label: 'Leaderboard', tab: 'leaderboard' },
    ],
  },
  { label: 'Reports', path: '/reports', icon: FileBarChart, accent: 'text' },
  {
    label: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
    accent: 'muted',
    items: [
      { label: 'Departments', tab: 'departments' },
      { label: 'Categories', tab: 'categories' },
      { label: 'ESG Configuration', tab: 'esg-config' },
      { label: 'Notification Settings', tab: 'notifications' },
    ],
  },
];

const ACCENT_TEXT = {
  env: 'text-env',
  social: 'text-social',
  gov: 'text-gov',
  game: 'text-game',
  text: 'text-text',
  muted: 'text-muted',
};

const ACCENT_BG = {
  env: 'bg-env/10',
  social: 'bg-social/10',
  gov: 'bg-gov/10',
  game: 'bg-game/10',
  text: 'bg-surface2',
  muted: 'bg-surface2',
};

const ACCENT_BORDER_L = {
  env: 'border-env',
  social: 'border-social',
  gov: 'border-gov',
  game: 'border-game',
  text: 'border-text',
  muted: 'border-muted',
};

const NavGroup = ({ group, onNavigate }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const activeTab = new URLSearchParams(location.search).get('tab');
  const Icon = group.icon;

  if (!group.items) {
    return (
      <NavLink
        to={group.path}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? cn(ACCENT_BG[group.accent], ACCENT_TEXT[group.accent], ACCENT_BORDER_L[group.accent])
              : 'text-muted hover:bg-surface2 hover:text-text',
          )
        }
      >
        <Icon className="h-4 w-4" />
        {group.label}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-text"
      >
        <span className="flex items-center gap-3">
          <Icon className={cn('h-4 w-4', ACCENT_TEXT[group.accent])} />
          {group.label}
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="ml-7 mt-1 flex animate-fade-in flex-col gap-0.5 border-l border-border pl-3">
          {group.items.map((item) => {
            const isActive = location.pathname === group.path && activeTab === item.tab;
            return (
              <NavLink
                key={item.tab}
                to={`${group.path}?tab=${item.tab}`}
                onClick={onNavigate}
                className={cn(
                  'rounded-md px-2 py-1.5 text-sm transition-colors',
                  isActive ? cn(ACCENT_BG[group.accent], ACCENT_TEXT[group.accent]) : 'text-muted hover:text-text',
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ mobileOpen, onClose }) => (
  <>
    {mobileOpen && (
      <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" role="presentation" onClick={onClose} />
    )}
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-surface p-4 transition-transform lg:static lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        <span className="flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-8 rounded-lg object-cover object-top shadow-soft" />
          <span className="text-lg font-semibold text-text">EcoSphere</span>
        </span>
        <button type="button" onClick={onClose} className="text-muted lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.label} group={group} onNavigate={onClose} />
        ))}
      </nav>
    </aside>
  </>
);
