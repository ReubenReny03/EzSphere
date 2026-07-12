import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useBadges = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.badges(filters),
    queryFn: () => apiClient.get('/badges', { params: filters }),
  });

export const useRewards = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.rewards(filters),
    queryFn: () => apiClient.get('/rewards', { params: filters }),
  });
