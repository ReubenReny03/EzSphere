import { cn } from '@/lib/cn';

const ACCENT_TEXT = {
  env: 'text-env border-env',
  social: 'text-social border-social',
  gov: 'text-gov border-gov',
  game: 'text-game border-game',
  text: 'text-text border-text',
  muted: 'text-muted border-muted',
};

export const Tabs = ({ tabs, active, onChange, accent = 'text' }) => (
  <div className="flex gap-1 border-b border-border" role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        role="tab"
        aria-selected={active === tab.value}
        onClick={() => onChange(tab.value)}
        className={cn(
          'rounded-t-md border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
          active === tab.value
            ? ACCENT_TEXT[accent]
            : 'border-transparent text-muted hover:bg-surface2/50 hover:text-text',
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
