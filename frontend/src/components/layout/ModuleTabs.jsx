import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';

const MODULES = [
  { label: 'Dashboard', path: '/dashboard', accent: 'text' },
  { label: 'Environmental', path: '/environmental', accent: 'env' },
  { label: 'Social', path: '/social', accent: 'social' },
  { label: 'Governance', path: '/governance', accent: 'gov' },
  { label: 'Gamification', path: '/gamification', accent: 'game' },
  { label: 'Reports', path: '/reports', accent: 'text' },
  { label: 'Settings', path: '/settings', accent: 'muted' },
];

const ACCENT_BORDER = {
  env: 'border-env text-env',
  social: 'border-social text-social',
  gov: 'border-gov text-gov',
  game: 'border-game text-game',
  text: 'border-text text-text',
  muted: 'border-muted text-muted',
};

export const ModuleTabs = () => (
  <div className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-4 lg:px-6">
    {MODULES.map((mod) => (
      <NavLink
        key={mod.path}
        to={mod.path}
        className={({ isActive }) =>
          cn(
            'shrink-0 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
            isActive ? ACCENT_BORDER[mod.accent] : 'border-transparent text-muted hover:bg-surface2/50 hover:text-text',
          )
        }
      >
        {mod.label}
      </NavLink>
    ))}
  </div>
);
