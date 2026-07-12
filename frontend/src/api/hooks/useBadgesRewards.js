import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export const useBadges = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.badges(filters),
    queryFn: () => apiClient.get('/badges', { params: filters }),
  });

export const useCreateBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post('/badges', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['badges'] }),
  });
};

export const useUpdateBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/badges/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['badges'] }),
  });
};

export const useDeleteBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/badges/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['badges'] }),
  });
};

export const useRewards = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.rewards(filters),
    queryFn: () => apiClient.get('/rewards', { params: filters }),
  });

export const useCreateReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post('/rewards', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewards'] }),
  });
};

export const useUpdateReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/rewards/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewards'] }),
  });
};

export const useDeleteReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/rewards/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewards'] }),
  });
};
