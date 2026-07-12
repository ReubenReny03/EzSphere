import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useLeaderboard = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.leaderboard(filters),
    queryFn: () => apiClient.get('/gamification/leaderboard', { params: filters }),
  });
