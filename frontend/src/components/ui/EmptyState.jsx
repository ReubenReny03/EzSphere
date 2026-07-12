import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({ icon: Icon = Inbox, message = 'Nothing here yet', actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
    <Icon className="h-8 w-8 text-muted" />
    <p className="text-sm text-muted">{message}</p>
    {actionLabel && onAction && (
      <Button size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
