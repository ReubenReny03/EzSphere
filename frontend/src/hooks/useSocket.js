import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { connectSocket } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';
import { queryKeys } from '@/api/queryKeys';
import { pushLiveFeedItem } from '@/lib/liveFeed';

const SOCKET_EVENTS = {
  NOTIFICATION_NEW: 'NOTIFICATION_NEW',
  LEADERBOARD_UPDATE: 'LEADERBOARD_UPDATE',
  APPROVAL_NEW: 'APPROVAL_NEW',
  CARBON_NEW: 'CARBON_NEW',
  SCORE_UPDATED: 'SCORE_UPDATED',
  BADGE_UNLOCKED: 'BADGE_UNLOCKED',
};

export const CONFETTI_EVENT = 'ecosphere:confetti';

export const useSocket = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return undefined;
    // AuthContext also connects on login, but this component (a descendant)
    // can mount in the same React commit as that effect (an ancestor) — and
    // child effects run before parent effects, so relying on AuthContext
    // having already connected races and can lose. Ensure the connection
    // here too; connectSocket is idempotent, so this is a no-op if it didn't.
    const socket = connectSocket(token);

    const onNotification = (notification) => {
      toast(notification.title);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Approval decisions (CSR/challenge participation) arrive as a
      // notification and can change the recipient's own XP/points balance.
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    };

    const onLeaderboardUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      pushLiveFeedItem(queryClient, { title: 'Leaderboard updated', message: 'Rankings shifted from new XP.' });
    };

    const onApprovalNew = () => {
      queryClient.invalidateQueries({ queryKey: ['csr', 'queue'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'participation'] });
    };

    const onCarbonNew = (transaction) => {
      queryClient.invalidateQueries({ queryKey: ['carbon'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.scoringOverview });
      pushLiveFeedItem(queryClient, {
        title: 'New carbon transaction logged',
        message: transaction?.co2Amount ? `+${Math.round(transaction.co2Amount)} kg CO₂e recorded` : 'A new activity was logged',
      });
    };

    const onScoreUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scoringOverview });
      queryClient.invalidateQueries({ queryKey: queryKeys.scoringDepartments });
    };

    const onBadgeUnlocked = (payload) => {
      toast.success(`🏅 Badge unlocked: ${payload.badge?.name ?? 'New badge'}!`, { duration: 5000 });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      pushLiveFeedItem(queryClient, {
        title: 'Badge unlocked',
        message: `${payload.badge?.name ?? 'A new badge'} was unlocked 🎉`,
      });
      window.dispatchEvent(new Event(CONFETTI_EVENT));
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, onNotification);
    socket.on(SOCKET_EVENTS.LEADERBOARD_UPDATE, onLeaderboardUpdate);
    socket.on(SOCKET_EVENTS.APPROVAL_NEW, onApprovalNew);
    socket.on(SOCKET_EVENTS.CARBON_NEW, onCarbonNew);
    socket.on(SOCKET_EVENTS.SCORE_UPDATED, onScoreUpdated);
    socket.on(SOCKET_EVENTS.BADGE_UNLOCKED, onBadgeUnlocked);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, onNotification);
      socket.off(SOCKET_EVENTS.LEADERBOARD_UPDATE, onLeaderboardUpdate);
      socket.off(SOCKET_EVENTS.APPROVAL_NEW, onApprovalNew);
      socket.off(SOCKET_EVENTS.CARBON_NEW, onCarbonNew);
      socket.off(SOCKET_EVENTS.SCORE_UPDATED, onScoreUpdated);
      socket.off(SOCKET_EVENTS.BADGE_UNLOCKED, onBadgeUnlocked);
    };
  }, [queryClient, token]);
};
