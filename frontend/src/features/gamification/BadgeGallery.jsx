import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useBadges, useDeleteBadge } from '@/api/hooks/useBadgesRewards';
import { BadgeModal } from './BadgeModal';

export const BadgeGallery = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const { data, isLoading } = useBadges({ status: 'active', limit: 50 });
  const deleteBadge = useDeleteBadge();
  const badges = data?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this badge?')) return;
    try {
      await deleteBadge.mutateAsync(id);
      toast.success('Badge deactivated');
    } catch (err) {
      // handled globally
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button
            variant="game"
            size="sm"
            onClick={() => {
              setEditingBadge(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Badge
          </Button>
        </div>
      )}

      {badges.length === 0 ? (
        <EmptyState message="No badges configured yet" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((badge) => (
            <div key={badge._id} className="relative flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center">
              {isAdmin && (
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBadge(badge);
                      setModalOpen(true);
                    }}
                    aria-label="Edit badge"
                    className="text-muted hover:text-text"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(badge._id)}
                    aria-label="Deactivate badge"
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <span className="text-3xl">{badge.icon || '🏅'}</span>
              <p className="text-sm font-semibold text-text">{badge.name}</p>
              <p className="text-xs text-muted">{badge.description}</p>
              <p className="text-xs text-game">
                {badge.unlockRule.metric} ≥ {badge.unlockRule.threshold}
              </p>
            </div>
          ))}
        </div>
      )}

      <BadgeModal open={modalOpen} onClose={() => setModalOpen(false)} badge={editingBadge} />
    </div>
  );
};
